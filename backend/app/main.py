from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import engine, Base, AsyncSessionLocal
from app.services.prompt_service import seed_prompts
from app.api.routes import health, uploads, analysis, reports, billing, admin, feature_flags, webhooks


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with AsyncSessionLocal() as db:
        await seed_prompts(db)
        await db.commit()
    yield
    await engine.dispose()


app = FastAPI(
    title="FocusAI API",
    description="AI-powered pre-publication content review",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, tags=["health"])
app.include_router(uploads.router, prefix="/api/uploads", tags=["uploads"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["analysis"])
app.include_router(reports.router, prefix="/api/reports", tags=["reports"])
app.include_router(billing.router, prefix="/api/billing", tags=["billing"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(feature_flags.router, prefix="/api/feature-flags", tags=["feature-flags"])
app.include_router(webhooks.router, prefix="/api/webhooks", tags=["webhooks"])
