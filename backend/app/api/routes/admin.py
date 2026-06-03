from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.auth import get_current_user_id
from app.models.user import User

router = APIRouter()


async def require_admin(
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
) -> str:
    result = await db.execute(select(User).where(User.clerk_id == user_id))
    user = result.scalar_one_or_none()
    if not user or not user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return user_id


@router.get("/users")
async def list_users(
    db: AsyncSession = Depends(get_db),
    _: str = Depends(require_admin),
):
    result = await db.execute(select(User))
    users = result.scalars().all()
    return {"users": [{"id": u.id, "email": u.email, "plan": u.plan} for u in users]}
