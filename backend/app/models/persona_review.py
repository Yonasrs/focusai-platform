from sqlalchemy import String, JSON, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

from app.core.database import Base


class PersonaReview(Base):
    __tablename__ = "persona_reviews"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    job_id: Mapped[str] = mapped_column(ForeignKey("analysis_jobs.id"), nullable=False, index=True)
    persona_name: Mapped[str] = mapped_column(String, nullable=False)  # skeptical | busy | enthusiastic
    sentiment: Mapped[str] = mapped_column(String, nullable=False)  # positive | neutral | negative
    feedback: Mapped[str] = mapped_column(String, nullable=False)
    raw_output: Mapped[dict] = mapped_column(JSON, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    job: Mapped["AnalysisJob"] = relationship(back_populates="persona_reviews")
