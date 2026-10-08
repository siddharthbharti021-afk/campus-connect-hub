"""
Pydantic schemas for digital certificates request, review, and verification.
"""
import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class CertificateApplyRequest(BaseModel):
    certificate_type: str = Field(
        min_length=3, max_length=60
    )  # BONAFIDE, TRANSCRIPT, CHARACTER, INTERNSHIP_NOC, COURSE_COMPLETION
    purpose: str = Field(min_length=3, max_length=255)
    additional_details: str | None = None


class CertificateActionRequest(BaseModel):
    action: str = Field(pattern="^(APPROVED|REJECTED|ISSUED)$")
    remarks: str | None = None


class CertificateOut(BaseModel):
    id: uuid.UUID
    student_id: uuid.UUID
    certificate_type: str
    purpose: str
    additional_details: str | None = None
    status: str
    reviewer_id: uuid.UUID | None = None
    reviewer_remarks: str | None = None
    verification_code: str
    document_url: str | None = None
    issued_at: datetime | None = None
    created_at: datetime
    student_name: str | None = None
    student_roll: str | None = None

    model_config = {"from_attributes": True}


class CertificateVerifyOut(BaseModel):
    is_valid: bool
    verification_code: str
    certificate_type: str
    student_name: str
    department_name: str | None = None
    issued_at: datetime | None = None
    status: str
    verification_message: str
