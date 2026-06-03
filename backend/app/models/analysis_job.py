from sqlalchemy import String, Integer, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import Optional

from app.core.database import Base


class AnalysisJob(Base):
    __tablename__ = "analysis_jobs"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    upload_id: Mapped[str] = mapped_column(ForeignKey("uploads.id"), nullable=False, index=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String, default="queued", nullable=False)  # queued | running | complete | failed
    credits_used: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    error_message: Mapped[Optional[str]] = mapped_column(String)
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    upload: Mapped["Upload"] = relationship(back_populates="analysis_jobs")
    expert_reviews: Mapped[list["ExpertReview"]] = relationship(back_populates="job")
    persona_reviews: Mapped[list["PersonaReview"]] = relationship(back_populates="job")
    final_report: Mapped[Optional["FinalReport"]] = relationship(back_populates="job", uselist=False)
    api_usage: Mapped[list["ApiUsage"]] = relationship(back_populates="job")
