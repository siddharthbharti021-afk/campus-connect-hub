"""
Digital certificates request, approval, and QR-verifiable issuance models.
"""
import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import Uuid

from app.database import Base


class CertificateRequest(Base):
    __tablename__ = "certificate_requests"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    student_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("user_profiles.id", ondelete="CASCADE"), nullable=False, index=True
    )
    certificate_type: Mapped[str] = mapped_column(
        String(60), nullable=False
    )  # BONAFIDE, TRANSCRIPT, CHARACTER, INTERNSHIP_NOC, COURSE_COMPLETION
    purpose: Mapped[str] = mapped_column(String(255), nullable=False)
    additional_details: Mapped[str | None] = mapped_column(Text, nullable=True)

    status: Mapped[str] = mapped_column(
        String(30), default="PENDING", nullable=False, index=True
    )  # PENDING, APPROVED, REJECTED, ISSUED

    reviewer_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("user_profiles.id", ondelete="SET NULL"), nullable=True
    )
    reviewer_remarks: Mapped[str | None] = mapped_column(String(255), nullable=True)

    verification_code: Mapped[str] = mapped_column(
        String(64), unique=True, nullable=False, index=True, default=lambda: uuid.uuid4().hex[:12].upper()
    )
    document_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    issued_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
