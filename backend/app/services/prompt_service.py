import uuid

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.prompt_version import PromptVersion

_SEED_PROMPTS = [
    ("HookExpert_v1",      "hook",      1, "Analyze the hook quality of this content."),
    ("RetentionExpert_v1", "retention", 1, "Analyze the retention and pacing of this content."),
    ("ClarityExpert_v1",   "clarity",   1, "Analyze the clarity and communication effectiveness of this content."),
    ("Moderator_v1",       "moderator", 1, "Synthesize all expert analyses into a final report."),
]


async def seed_prompts(db: AsyncSession) -> None:
    """Insert default prompt versions on first startup; skip if already present."""
    for name, expert, version, text in _SEED_PROMPTS:
        result = await db.execute(select(PromptVersion).where(PromptVersion.name == name))
        if result.scalar_one_or_none() is None:
            db.add(PromptVersion(
                id=str(uuid.uuid4()),
                name=name,
                expert=expert,
                version=version,
                prompt_text=text,
                is_active=True,
            ))
    await db.flush()


async def get_active_prompt(expert: str, db: AsyncSession) -> PromptVersion | None:
    """Return the highest-version active prompt for a given expert."""
    result = await db.execute(
        select(PromptVersion)
        .where(PromptVersion.expert == expert, PromptVersion.is_active == True)
        .order_by(PromptVersion.version.desc())
        .limit(1)
    )
    return result.scalar_one_or_none()
