"""
Pydantic schemas for the Academic Intelligence & Early-Warning Dropout Risk Engine.
"""
import uuid
from pydantic import BaseModel


class StudentRiskFactor(BaseModel):
    category: str  # ATTENDANCE, MARKS, ASSIGNMENTS, BEHAVIOR
    severity: str  # LOW, MEDIUM, HIGH, CRITICAL
    description: str


class StudentRiskReport(BaseModel):
    student_id: uuid.UUID
    student_name: str
    email: str
    department_name: str | None = None
    semester: int | None = None
    attendance_rate: float
    assignment_completion_rate: float
    risk_score: float  # 0 to 100
    risk_level: str    # SAFE, MODERATE_RISK, HIGH_RISK, CRITICAL
    risk_factors: list[StudentRiskFactor] = []
    recommended_interventions: list[str] = []


class AtRiskStudentSummary(BaseModel):
    student_id: uuid.UUID
    student_name: str
    email: str
    department_name: str | None = None
    attendance_rate: float
    risk_score: float
    risk_level: str
    top_concern: str
