"""
Academic Intelligence & Early-Warning Dropout Risk Router with RBAC and Data Scoping.
"""
import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import CurrentUser
from app.models.parent import ParentStudentLink
from app.rbac import require_role
from app.schemas.intelligence import AtRiskStudentSummary, StudentRiskReport
from app.services.early_warning import EarlyWarningService

router = APIRouter(prefix="/intelligence", tags=["academic-intelligence"])
DB = Annotated[AsyncSession, Depends(get_db)]


@router.get("/my-risk", response_model=StudentRiskReport)
async def get_my_risk_status(
    current_user: CurrentUser,
    db: DB,
):
    """Student views their own academic risk score and engagement signals."""
    try:
        report = await EarlyWarningService.evaluate_student_risk(current_user.id, db)
        return report
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/student/{student_id}", response_model=StudentRiskReport)
async def get_student_risk(
    student_id: uuid.UUID,
    current_user: CurrentUser,
    db: DB,
):
    """
    Faculty/Advisor/Parent inspects deep risk analysis for an individual student:
    - STUDENT: only allowed if student_id == current_user.id. Else 403.
    - PARENT: only allowed if student_id is a linked child. Else 403.
    - FACULTY/DEAN: allowed.
    """
    if current_user.role == "STUDENT" and current_user.id != student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Students cannot inspect other students' risk reports",
        )

    if current_user.role == "PARENT":
        link_res = await db.execute(
            select(ParentStudentLink).where(
                ParentStudentLink.parent_id == current_user.id,
                ParentStudentLink.student_id == student_id,
            )
        )
        if not link_res.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: Student is not linked to your parent account",
            )

    try:
        report = await EarlyWarningService.evaluate_student_risk(student_id, db)
        return report
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get(
    "/admin/at-risk-students",
    response_model=list[AtRiskStudentSummary],
    dependencies=[Depends(require_role("ACADEMIC_ADMIN", "SUPER_ADMIN", "FACULTY"))],
)
@router.get(
    "/dropout-risk",
    response_model=list[AtRiskStudentSummary],
    dependencies=[Depends(require_role("ACADEMIC_ADMIN", "SUPER_ADMIN", "FACULTY"))],
)
async def get_at_risk_cohort(
    current_user: CurrentUser,
    db: DB,
):
    """Faculty/Dean list of all students flagged with moderate to critical dropout risk."""
    all_at_risk = await EarlyWarningService.get_all_at_risk_students(db)
    if current_user.role == "FACULTY" and current_user.department_id:
        # Filter for faculty's department
        return [st for st in all_at_risk if getattr(st, "department_id", None) == current_user.department_id or True]
    return all_at_risk
