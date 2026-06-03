import uuid

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.user import User


async def get_or_create_user(clerk_id: str, db: AsyncSession) -> User:
    """Return the DB user for a Clerk ID, creating one on first sign-in."""
    result = await db.execute(select(User).where(User.clerk_id == clerk_id))
    user = result.scalar_one_or_none()

    if not user:
        user = User(
            id=str(uuid.uuid4()),
            clerk_id=clerk_id,
            # Placeholder email — updated when Clerk webhook fires in a later milestone
            email=f"pending+{clerk_id}@focusai.local",
            plan="free",
            credits_remaining=3,
        )
        db.add(user)
        await db.flush()

    return user
