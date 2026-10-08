"""
Pydantic schemas for the Parent Portal.
"""
import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class LinkChildRequest(BaseModel):
    student_email: str
    relationship: str = "PARENT"  # FATHER, MOTHER, GUARDIAN


class ChildSummaryOut(BaseModel):
    student_id: uuid.UUID
    full_name: str
    email: str
    department_name: str | None = None
    year_of_study: int | None = None
    attendance_percentage: float | None = None
    pending_fees: float = 0.0
    active_risk_level: str = "LOW"
    relationship: str


class ParentStudentLinkOut(BaseModel):
    id: uuid.UUID
    parent_id: uuid.UUID
    student_id: uuid.UUID
    relationship: str
    is_verified: bool
    created_at: datetime

    model_config = {"from_attributes": True}
