"""
Parent Portal Router with strict RBAC.
Allows authenticated parents to monitor attendance, fee dues, exam dates,
and academic progress ONLY for their linked children.
"""
import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import CurrentUser
from app.models.academic import Department
from app.models.attendance import AttendanceRecord
from app.models.fees import FeeInvoice
from app.models.parent import ParentStudentLink
from app.models.user import UserProfile
from app.rbac import require_role
from app.schemas.parent import ChildSummaryOut, LinkChildRequest, ParentStudentLinkOut
from app.services.early_warning import EarlyWarningService

router = APIRouter(prefix="/parent", tags=["parent"])
DB = Annotated[AsyncSession, Depends(get_db)]


@router.get(
    "/my-children",
    response_model=list[ChildSummaryOut],
    dependencies=[Depends(require_role("PARENT", "SUPER_ADMIN", "ACADEMIC_ADMIN"))],
)
async def get_my_children(
    current_user: CurrentUser,
    db: DB,
):
    """Fetch overview of all enrolled children linked ONLY to this parent."""
    links_res = await db.execute(
        select(ParentStudentLink).where(ParentStudentLink.parent_id == current_user.id)
    )
    links = links_res.scalars().all()

    children_out = []
    for link in links:
        st_res = await db.execute(
            select(UserProfile).where(UserProfile.id == link.student_id)
        )
        student = st_res.scalar_one_or_none()
        if not student:
            continue

        dept_name = None
        if student.department_id:
            dept_res = await db.execute(
                select(Department).where(Department.id == student.department_id)
            )
            dept = dept_res.scalar_one_or_none()
            if dept:
                dept_name = dept.name

        att_res = await db.execute(
            select(AttendanceRecord).where(AttendanceRecord.student_id == student.id)
        )
        att_records = list(att_res.scalars().all())
        att_pct = None
        if att_records:
            present = sum(1 for r in att_records if r.status in ("present", "late"))
            att_pct = round((present / len(att_records)) * 100, 1)

        inv_res = await db.execute(
            select(FeeInvoice).where(
                FeeInvoice.student_id == student.id, FeeInvoice.status != "PAID"
            )
        )
        invoices = inv_res.scalars().all()
        pending_fees = sum(max(0.0, i.total_amount - i.paid_amount) for i in invoices)

        risk_level = "LOW"
        try:
            report = await EarlyWarningService.evaluate_student_risk(student.id, db)
            risk_level = report.risk_level
        except Exception:
            pass

        children_out.append(
            ChildSummaryOut(
                student_id=student.id,
                full_name=student.full_name,
                email=student.email,
                department_name=dept_name,
                year_of_study=student.year_of_study,
                attendance_percentage=att_pct,
                pending_fees=round(pending_fees, 2),
                active_risk_level=risk_level,
                relationship=link.relationship,
            )
        )

    return children_out


@router.post(
    "/link-child",
    response_model=ParentStudentLinkOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_role("PARENT", "SUPER_ADMIN", "ACADEMIC_ADMIN"))],
)
async def link_child_to_parent(
    body: LinkChildRequest,
    current_user: CurrentUser,
    db: DB,
):
    """Link a student account to the authenticated parent."""
    st_res = await db.execute(
        select(UserProfile).where(
            (UserProfile.email == body.student_email) | (UserProfile.user_code == body.student_email)
        )
    )
    student = st_res.scalar_one_or_none()
    if not student:
        raise HTTPException(status_code=404, detail="Student email or User ID not found on campus records")

    existing_res = await db.execute(
        select(ParentStudentLink).where(
            ParentStudentLink.parent_id == current_user.id,
            ParentStudentLink.student_id == student.id,
        )
    )
    if existing_res.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Student is already linked to your profile")

    link = ParentStudentLink(
        parent_id=current_user.id,
        student_id=student.id,
        relationship=body.relationship.upper(),
        is_verified=True,
    )
    db.add(link)
    await db.commit()
    await db.refresh(link)
    return ParentStudentLinkOut.model_validate(link)
