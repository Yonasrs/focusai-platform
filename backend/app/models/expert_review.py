from sqlalchemy import String, Float, JSON, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

from app.core.database import Base


class ExpertReview(Base):
    __tablename__ = "expert_reviews"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    job_id: Mapped[str] = mapped_column(ForeignKey("analysis_jobs.id"), nullable=False, index=True)
    expert_name: Mapped[str] = mapped_column(String, nullable=False)  # hook | retention | clarity
    prompt_version: Mapped[str] = mapped_column(String, nullable=False)  # e.g. HookExpert_v1
    score: Mapped[float] = mapped_column(Float, nullable=False)
    output: Mapped[dict] = mapped_column(JSON, nullable=False)  # full structured output
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    job: Mapped["AnalysisJob"] = relationship(back_populates="expert_reviews")
