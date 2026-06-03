from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid

from svix.webhooks import Webhook, WebhookVerificationError

from app.core.config import settings
from app.core.database import get_db
from app.models.user import User

router = APIRouter()


def _primary_email(data: dict) -> str:
    primary_id = data.get("primary_email_address_id")
    for addr in data.get("email_addresses", []):
        if addr.get("id") == primary_id:
            return addr["email_address"]
    addrs = data.get("email_addresses", [])
    return addrs[0]["email_address"] if addrs else ""


@router.post("/clerk")
async def clerk_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    # Must read raw bytes before any parsing — Svix verifies the exact bytes + headers
    body = await request.body()

    wh = Webhook(settings.CLERK_WEBHOOK_SECRET)
    try:
        payload = wh.verify(body, dict(request.headers))
    except WebhookVerificationError:
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    event_type = payload.get("type")
    data = payload.get("data", {})
    clerk_id = data.get("id")

    if not clerk_id or event_type not in ("user.created", "user.updated"):
        return {"status": "ignored"}

    email = _primary_email(data)

    result = await db.execute(select(User).where(User.clerk_id == clerk_id))
    user = result.scalar_one_or_none()

    if user is None:
        user = User(
            id=str(uuid.uuid4()),
            clerk_id=clerk_id,
            email=email,
            plan="free",
            credits_remaining=3,
        )
        db.add(user)
    else:
        if email:
            user.email = email

    return {"status": "ok"}
