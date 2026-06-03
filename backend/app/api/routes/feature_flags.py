from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.auth import get_current_user_id
from app.core.feature_flags import get_all_flags

router = APIRouter()


@router.get("/")
async def list_feature_flags(
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    flags = await get_all_flags(db)
    return {"flags": flags}
