from enum import Enum
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.feature_flag import FeatureFlag


class Flag(str, Enum):
    PREPUBLISH = "PREPUBLISH"
    AUDIENCELAB = "AUDIENCELAB"
    HOOK_EXPERT = "HOOK_EXPERT"
    RETENTION_EXPERT = "RETENTION_EXPERT"
    CLARITY_EXPERT = "CLARITY_EXPERT"
    PDF_REPORT = "PDF_REPORT"


# Default state for each flag
_DEFAULTS: dict[Flag, bool] = {
    Flag.PREPUBLISH: True,
    Flag.AUDIENCELAB: False,
    Flag.HOOK_EXPERT: True,
    Flag.RETENTION_EXPERT: True,
    Flag.CLARITY_EXPERT: True,
    Flag.PDF_REPORT: False,
}


async def is_enabled(flag: Flag, db: AsyncSession, user_id: Optional[str] = None) -> bool:
    """Check if a feature flag is enabled. DB value overrides default."""
    result = await db.execute(
        select(FeatureFlag).where(FeatureFlag.name == flag.value)
    )
    record = result.scalar_one_or_none()
    if record is not None:
        return record.enabled
    return _DEFAULTS.get(flag, False)


async def get_all_flags(db: AsyncSession) -> dict[str, bool]:
    result = await db.execute(select(FeatureFlag))
    db_flags = {r.name: r.enabled for r in result.scalars().all()}
    return {
        flag.value: db_flags.get(flag.value, _DEFAULTS.get(flag, False))
        for flag in Flag
    }
