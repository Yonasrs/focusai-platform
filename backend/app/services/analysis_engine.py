import uuid
from datetime import datetime, timezone
from typing import Optional

import structlog
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import AsyncSessionLocal
from app.core.feature_flags import Flag, is_enabled
from app.experts.base import AbstractExpert
from app.experts.hook_expert import HookExpert
from app.experts.retention_expert import RetentionExpert
from app.experts.clarity_expert import ClarityExpert
from app.models.analysis_job import AnalysisJob
from app.models.expert_review import ExpertReview
from app.models.final_report import FinalReport
from app.models.upload import Upload
from app.services.prompt_service import get_active_prompt

log = structlog.get_logger()

_EXPERTS: list[tuple[AbstractExpert, Flag]] = [
    (HookExpert(),      Flag.HOOK_EXPERT),
    (RetentionExpert(), Flag.RETENTION_EXPERT),
    (ClarityExpert(),   Flag.CLARITY_EXPERT),
]


async def run_analysis(job_id: str, db: AsyncSession) -> None:
    """
    Orchestrate the full analysis pipeline for a queued job.
    Transitions: queued → running → complete | failed
    """
    job: Optional[AnalysisJob] = (
        await db.execute(select(AnalysisJob).where(AnalysisJob.id == job_id))
    ).scalar_one_or_none()

    if not job:
        log.warning("analysis_engine.job_not_found", job_id=job_id)
        return

    upload: Optional[Upload] = (
        await db.execute(select(Upload).where(Upload.id == job.upload_id))
    ).scalar_one_or_none()

    if not upload:
        job.status = "failed"
        job.error_message = "Upload record not found"
        return

    job.status = "running"
    job.started_at = datetime.now(timezone.utc)
    await db.flush()
    log.info("analysis_engine.started", job_id=job_id, upload_id=upload.id)

    try:
        expert_scores: list[float] = []

        for expert, flag in _EXPERTS:
            if not await is_enabled(flag, db):
                log.debug("analysis_engine.expert_skipped", expert=expert.name, flag=flag.value)
                continue

            prompt = await get_active_prompt(expert.name, db)
            prompt_text = prompt.prompt_text if prompt else ""
            prompt_name = prompt.name if prompt else f"{expert.name}_v0"

            result = await expert.analyze(
                content_type=upload.content_type,
                s3_key=upload.s3_key,
                text_content=None,
                prompt_text=prompt_text,
            )

            db.add(ExpertReview(
                id=str(uuid.uuid4()),
                job_id=job.id,
                expert_name=expert.name,
                prompt_version=prompt_name,
                score=result.score,
                output=result.output,
            ))
            expert_scores.append(result.score)
            log.info("analysis_engine.expert_done", expert=expert.name, score=result.score)

        # Moderator stub — M7 replaces this with a real Anthropic synthesis call
        moderator_prompt = await get_active_prompt("moderator", db)
        moderator_version = moderator_prompt.name if moderator_prompt else "Moderator_v0"
        final_score = round(sum(expert_scores) / len(expert_scores), 2) if expert_scores else 0.0

        db.add(FinalReport(
            id=str(uuid.uuid4()),
            job_id=job.id,
            user_id=job.user_id,
            final_score=final_score,
            summary="Analysis complete. Full synthesis available from Milestone 7.",
            strengths=[],
            weaknesses=[],
            top_recommendations=[],
            top_risks=[],
            moderator_prompt_version=moderator_version,
        ))

        job.status = "complete"
        job.completed_at = datetime.now(timezone.utc)
        log.info("analysis_engine.complete", job_id=job_id, final_score=final_score)

    except Exception as exc:
        job.status = "failed"
        job.error_message = str(exc)
        job.completed_at = datetime.now(timezone.utc)
        log.error("analysis_engine.failed", job_id=job_id, error=str(exc))
        raise


async def run_analysis_task(job_id: str) -> None:
    """
    Background-task entry point.  Creates its own DB session because
    the request session is already closed when FastAPI runs BackgroundTasks.
    """
    async with AsyncSessionLocal() as db:
        try:
            await run_analysis(job_id, db)
            await db.commit()
        except Exception:
            await db.rollback()
