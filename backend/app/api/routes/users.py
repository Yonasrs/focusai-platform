from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user_id
from app.core.database import get_db
from app.services.user_service import get_or_create_user

router = APIRouter()


@router.get("/me")
async def get_me(
    db: AsyncSession = Depends(get_db),
    clerk_user_id: str = Depends(get_current_user_id),
):
    user = await get_or_create_user(clerk_user_id, db)
    return {
        "plan": user.plan,
        "credits_remaining": user.credits_remaining,
        "email": user.email,
        "is_admin": user.is_admin,
    }
