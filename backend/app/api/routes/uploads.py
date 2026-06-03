from typing import Annotated, Optional

from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.auth import get_current_user_id
from app.core.database import get_db
from app.models.analysis_job import AnalysisJob
from app.models.upload import Upload
from app.schemas.upload import JobResponse, JobStatusResponse, UploadCreateResponse, UploadResponse
from app.services.analysis_engine import run_analysis_task
from app.services.upload_service import create_upload
from app.services.user_service import get_or_create_user

router = APIRouter()

# 1 GB + 1 byte — anything larger triggers an error before we buffer it
_MAX_READ = 1024 * 1024 * 1024 + 1


@router.post("/", response_model=UploadCreateResponse, status_code=status.HTTP_201_CREATED)
async def upload_content(
    content_type: Annotated[str, Form()],
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    clerk_user_id: str = Depends(get_current_user_id),
    file: Annotated[Optional[UploadFile], File()] = None,
    text_content: Annotated[Optional[str], Form()] = None,
    duration_seconds: Annotated[Optional[int], Form()] = None,
):
    """
    Accept a video, image, or text upload.

    Form fields:
      - content_type: "video" | "image" | "text"
      - file: UploadFile (required for video/image)
      - text_content: str (required for text)
      - duration_seconds: int (optional, client-reported video duration)
    """
    if content_type not in ("video", "image", "text"):
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            detail="content_type must be one of: video, image, text.",
        )

    user = await get_or_create_user(clerk_user_id, db)

    if content_type == "text":
        if not text_content or len(text_content.strip()) < 20:
            raise HTTPException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Text content must be at least 20 characters.",
            )
        file_bytes = text_content.encode("utf-8")
        filename = "content.txt"
    else:
        if not file:
            raise HTTPException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"A file is required for {content_type} uploads.",
            )
        file_bytes = await file.read(_MAX_READ)
        filename = file.filename or f"upload.{content_type}"

    upload, job = await create_upload(
        user=user,
        content_type=content_type,
        filename=filename,
        file_bytes=file_bytes,
        duration_seconds=duration_seconds,
        db=db,
    )

    background_tasks.add_task(run_analysis_task, job.id)

    return UploadCreateResponse(
        upload=UploadResponse.model_validate(upload),
        job=JobResponse.model_validate(job),
        message="Upload successful. Analysis queued.",
    )


@router.get("/", response_model=list[UploadResponse])
async def list_uploads(
    db: AsyncSession = Depends(get_db),
    clerk_user_id: str = Depends(get_current_user_id),
):
    user = await get_or_create_user(clerk_user_id, db)
    result = await db.execute(
        select(Upload)
        .where(Upload.user_id == user.id)
        .order_by(Upload.created_at.desc())
    )
    return [UploadResponse.model_validate(u) for u in result.scalars().all()]


@router.get("/jobs/{job_id}", response_model=JobStatusResponse)
async def get_job_status(
    job_id: str,
    db: AsyncSession = Depends(get_db),
    clerk_user_id: str = Depends(get_current_user_id),
):
    user = await get_or_create_user(clerk_user_id, db)
    job_result = await db.execute(
        select(AnalysisJob).where(
            AnalysisJob.id == job_id,
            AnalysisJob.user_id == user.id,
        )
    )
    job = job_result.scalar_one_or_none()
    if not job:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Job not found.")

    upload_result = await db.execute(select(Upload).where(Upload.id == job.upload_id))
    upload = upload_result.scalar_one_or_none()

    _STATUS_MSG = {
        "queued":   "Your content is queued for analysis.",
        "running":  "Analysis in progress…",
        "complete": "Analysis complete!",
        "failed":   "Analysis failed. Please try again.",
    }

    return JobStatusResponse(
        job_id=job.id,
        status=job.status,
        upload=UploadResponse.model_validate(upload) if upload else None,
        message=_STATUS_MSG.get(job.status, "Unknown status."),
    )
