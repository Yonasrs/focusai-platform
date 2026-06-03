import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.analysis_job import AnalysisJob
from app.models.upload import Upload
from app.models.user import User
from app.services.s3_service import s3_service


# ── Allowed MIME types per content category ────────────────────────────────
ALLOWED_MIME: dict[str, list[str]] = {
    "video": ["video/mp4"],
    "image": ["image/jpeg", "image/png"],
    "text":  ["text/plain"],
}

# ── Per-plan upload limits ──────────────────────────────────────────────────
PLAN_LIMITS: dict[str, dict] = {
    "free": {"max_bytes": 100 * 1024 * 1024,        "max_duration_sec": 30},
    "pro":  {"max_bytes": 1024 * 1024 * 1024,        "max_duration_sec": 300},
}

# ── Magic-byte signatures ───────────────────────────────────────────────────
_MAGIC: list[tuple[bytes, str]] = [
    (b"\xff\xd8\xff",         "image/jpeg"),
    (b"\x89PNG\r\n\x1a\n",   "image/png"),
]


def _sniff_mime(header: bytes) -> Optional[str]:
    """Detect MIME type from the first few bytes of a file."""
    for sig, mime in _MAGIC:
        if header[: len(sig)] == sig:
            return mime
    # MP4: 'ftyp' box at byte offset 4
    if len(header) >= 12 and header[4:8] == b"ftyp":
        return "video/mp4"
    return None


async def create_upload(
    *,
    user: User,
    content_type: str,
    filename: str,
    file_bytes: bytes,
    duration_seconds: Optional[int],
    db: AsyncSession,
) -> tuple[Upload, AnalysisJob]:
    # ── Credit check ───────────────────────────────────────────────────────
    if user.credits_remaining <= 0:
        raise HTTPException(
            status.HTTP_402_PAYMENT_REQUIRED,
            detail="No credits remaining. Please upgrade your plan.",
        )

    limits = PLAN_LIMITS.get(user.plan, PLAN_LIMITS["free"])

    # ── Size check ─────────────────────────────────────────────────────────
    if len(file_bytes) > limits["max_bytes"]:
        max_mb = limits["max_bytes"] // (1024 * 1024)
        unit = "GB" if max_mb >= 1024 else "MB"
        display = f"{max_mb // 1024} {unit}" if max_mb >= 1024 else f"{max_mb} MB"
        raise HTTPException(
            status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds the {display} limit for the {user.plan} plan.",
        )

    # ── MIME / magic-byte validation ────────────────────────────────────────
    if content_type == "text":
        actual_mime = "text/plain"
    else:
        actual_mime = _sniff_mime(file_bytes[:12])
        if actual_mime not in ALLOWED_MIME.get(content_type, []):
            raise HTTPException(
                status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail=f"Invalid file type for {content_type} upload. "
                       f"Accepted: {', '.join(ALLOWED_MIME[content_type])}",
            )

    # ── Video duration check (client-reported) ─────────────────────────────
    if content_type == "video" and duration_seconds is not None:
        max_dur = limits["max_duration_sec"]
        if duration_seconds > max_dur:
            label = f"{max_dur}s" if max_dur < 60 else f"{max_dur // 60} min"
            raise HTTPException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Video exceeds the {label} limit for the {user.plan} plan.",
            )

    # ── Upload to S3 ───────────────────────────────────────────────────────
    upload_id = str(uuid.uuid4())
    s3_key = await s3_service.upload(
        content=file_bytes,
        user_id=user.id,
        upload_id=upload_id,
        filename=filename,
        mime_type=actual_mime,
    )

    # ── Persist upload record ──────────────────────────────────────────────
    upload = Upload(
        id=upload_id,
        user_id=user.id,
        filename=filename,
        content_type=content_type,
        s3_key=s3_key,
        file_size_bytes=len(file_bytes),
        duration_seconds=duration_seconds,
        status="complete",
        expires_at=datetime.now(timezone.utc) + timedelta(days=30),
    )
    db.add(upload)
    await db.flush()

    # ── Deduct credit ──────────────────────────────────────────────────────
    user.credits_remaining = max(0, user.credits_remaining - 1)

    # ── Create analysis job ────────────────────────────────────────────────
    job = AnalysisJob(
        id=str(uuid.uuid4()),
        upload_id=upload_id,
        user_id=user.id,
        status="queued",
        credits_used=1,
    )
    db.add(job)
    await db.flush()

    return upload, job
