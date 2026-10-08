"""
Digital Certificates Router with RBAC and Data Scoping.
"""
import uuid
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import CurrentUser
from app.models.academic import Department
from app.models.certificates import CertificateRequest
from app.models.parent import ParentStudentLink
from app.models.user import UserProfile
from app.rbac import require_role
from app.schemas.certificates import (
    CertificateActionRequest,
    CertificateApplyRequest,
    CertificateOut,
    CertificateVerifyOut,
)

router = APIRouter(prefix="/certificates", tags=["certificates"])
DB = Annotated[AsyncSession, Depends(get_db)]


@router.post("/apply", response_model=CertificateOut, status_code=status.HTTP_201_CREATED)
async def apply_for_certificate(
    body: CertificateApplyRequest,
    current_user: CurrentUser,
    db: DB,
):
    """Student applies for an official digital certificate."""
    cert = CertificateRequest(
        student_id=current_user.id,
        certificate_type=body.certificate_type.upper(),
        purpose=body.purpose,
        additional_details=body.additional_details,
        status="PENDING",
        verification_code=uuid.uuid4().hex[:12].upper(),
    )
    db.add(cert)
    await db.commit()
    await db.refresh(cert)

    return CertificateOut(
        id=cert.id,
        student_id=cert.student_id,
        certificate_type=cert.certificate_type,
        purpose=cert.purpose,
        additional_details=cert.additional_details,
        status=cert.status,
        reviewer_id=cert.reviewer_id,
        reviewer_remarks=cert.reviewer_remarks,
        verification_code=cert.verification_code,
        document_url=cert.document_url,
        issued_at=cert.issued_at,
        created_at=cert.created_at,
        student_name=current_user.full_name,
    )


@router.get("/my-requests", response_model=list[CertificateOut])
@router.get("/me", response_model=list[CertificateOut])
async def get_my_certificates(
    current_user: CurrentUser,
    db: DB,
):
    """
    Fetch certificates for authenticated user:
    - STUDENT: their own certificates.
    - PARENT: certificates of their linked children.
    - DEAN/ADMIN: all campus certificate requests.
    """
    if current_user.role in ("ACADEMIC_ADMIN", "SUPER_ADMIN"):
        q = select(CertificateRequest).order_by(CertificateRequest.created_at.desc())
    elif current_user.role == "PARENT":
        links_res = await db.execute(
            select(ParentStudentLink.student_id).where(ParentStudentLink.parent_id == current_user.id)
        )
        linked_student_ids = list(links_res.scalars().all())
        if not linked_student_ids:
            return []
        q = select(CertificateRequest).where(CertificateRequest.student_id.in_(linked_student_ids)).order_by(CertificateRequest.created_at.desc())
    else:  # STUDENT or FACULTY
        q = select(CertificateRequest).where(CertificateRequest.student_id == current_user.id).order_by(CertificateRequest.created_at.desc())

    res = await db.execute(q)
    certs = res.scalars().all()

    output = []
    for c in certs:
        st_res = await db.execute(select(UserProfile).where(UserProfile.id == c.student_id))
        st = st_res.scalar_one_or_none()
        output.append(
            CertificateOut(
                id=c.id,
                student_id=c.student_id,
                certificate_type=c.certificate_type,
                purpose=c.purpose,
                additional_details=c.additional_details,
                status=c.status,
                reviewer_id=c.reviewer_id,
                reviewer_remarks=c.reviewer_remarks,
                verification_code=c.verification_code,
                document_url=c.document_url,
                issued_at=c.issued_at,
                created_at=c.created_at,
                student_name=st.full_name if st else "Student",
            )
        )
    return output


@router.get("/student/{student_id}", response_model=list[CertificateOut])
async def get_student_certificates(
    student_id: uuid.UUID,
    current_user: CurrentUser,
    db: DB,
):
    """
    Fetch certificates for a specific student with RBAC checks:
    - STUDENT: only if student_id == current_user.id, else 403.
    - PARENT: only if student_id is linked to parent, else 403.
    - DEAN/ADMIN/FACULTY: allowed.
    """
    if current_user.role == "STUDENT" and current_user.id != student_id:
        raise HTTPException(status_code=403, detail="Access denied")

    if current_user.role == "PARENT":
        link_res = await db.execute(
            select(ParentStudentLink).where(
                ParentStudentLink.parent_id == current_user.id,
                ParentStudentLink.student_id == student_id,
            )
        )
        if not link_res.scalar_one_or_none():
            raise HTTPException(status_code=403, detail="Access denied: Unlinked student")

    res = await db.execute(
        select(CertificateRequest)
        .where(CertificateRequest.student_id == student_id)
        .order_by(CertificateRequest.created_at.desc())
    )
    certs = res.scalars().all()

    st_res = await db.execute(select(UserProfile).where(UserProfile.id == student_id))
    st = st_res.scalar_one_or_none()
    st_name = st.full_name if st else "Student"

    return [
        CertificateOut(
            id=c.id,
            student_id=c.student_id,
            certificate_type=c.certificate_type,
            purpose=c.purpose,
            additional_details=c.additional_details,
            status=c.status,
            reviewer_id=c.reviewer_id,
            reviewer_remarks=c.reviewer_remarks,
            verification_code=c.verification_code,
            document_url=c.document_url,
            issued_at=c.issued_at,
            created_at=c.created_at,
            student_name=st_name,
        )
        for c in certs
    ]


@router.get("/verify/{verification_code}", response_model=CertificateVerifyOut)
async def verify_certificate(
    verification_code: str,
    db: DB,
):
    """Public verification endpoint for official credential QR codes."""
    res = await db.execute(
        select(CertificateRequest).where(
            CertificateRequest.verification_code == verification_code.upper()
        )
    )
    cert = res.scalar_one_or_none()
    if not cert:
        return CertificateVerifyOut(
            is_valid=False,
            verification_code=verification_code,
            certificate_type="UNKNOWN",
            student_name="N/A",
            status="NOT_FOUND",
            verification_message="Invalid verification code. This certificate was not issued by the institution.",
        )

    st_res = await db.execute(select(UserProfile).where(UserProfile.id == cert.student_id))
    st = st_res.scalar_one_or_none()
    st_name = st.full_name if st else "Verified Student"

    dept_name = None
    if st and st.department_id:
        dept_res = await db.execute(select(Department).where(Department.id == st.department_id))
        dept = dept_res.scalar_one_or_none()
        if dept:
            dept_name = dept.name

    is_valid = cert.status in ["APPROVED", "ISSUED"]
    msg = (
        "Certificate is authentic, approved, and officially verified by the University Academic Registry."
        if is_valid
        else f"Certificate is currently in {cert.status} status and not yet officially verified."
    )

    return CertificateVerifyOut(
        is_valid=is_valid,
        verification_code=cert.verification_code,
        certificate_type=cert.certificate_type,
        student_name=st_name,
        department_name=dept_name,
        issued_at=cert.issued_at or cert.created_at,
        status=cert.status,
        verification_message=msg,
    )


@router.get(
    "/admin/requests",
    response_model=list[CertificateOut],
    dependencies=[Depends(require_role("ACADEMIC_ADMIN", "SUPER_ADMIN"))],
)
async def get_admin_certificate_requests(
    current_user: CurrentUser,
    db: DB,
    status_filter: str | None = None,
):
    """Admin queue to inspect pending certificate applications."""
    q = select(CertificateRequest)
    if status_filter:
        q = q.where(CertificateRequest.status == status_filter.upper())
    result = await db.execute(q.order_by(CertificateRequest.created_at.desc()))
    certs = result.scalars().all()

    output = []
    for c in certs:
        st_res = await db.execute(select(UserProfile).where(UserProfile.id == c.student_id))
        st = st_res.scalar_one_or_none()
        output.append(
            CertificateOut(
                id=c.id,
                student_id=c.student_id,
                certificate_type=c.certificate_type,
                purpose=c.purpose,
                additional_details=c.additional_details,
                status=c.status,
                reviewer_id=c.reviewer_id,
                reviewer_remarks=c.reviewer_remarks,
                verification_code=c.verification_code,
                document_url=c.document_url,
                issued_at=c.issued_at,
                created_at=c.created_at,
                student_name=st.full_name if st else "Student",
            )
        )
    return output


@router.post(
    "/admin/{certificate_id}/action",
    response_model=CertificateOut,
    dependencies=[Depends(require_role("ACADEMIC_ADMIN", "SUPER_ADMIN"))],
)
async def review_certificate(
    certificate_id: uuid.UUID,
    body: CertificateActionRequest,
    current_user: CurrentUser,
    db: DB,
):
    """Admin approves, rejects, or issues a certificate."""
    res = await db.execute(
        select(CertificateRequest).where(CertificateRequest.id == certificate_id)
    )
    cert = res.scalar_one_or_none()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate request not found")

    cert.status = body.action
    cert.reviewer_id = current_user.id
    cert.reviewer_remarks = body.remarks
    if body.action in ["APPROVED", "ISSUED"]:
        cert.issued_at = datetime.now()
        cert.document_url = f"/api/v1/certificates/verify/{cert.verification_code}"

    await db.commit()
    await db.refresh(cert)

    return CertificateOut(
        id=cert.id,
        student_id=cert.student_id,
        certificate_type=cert.certificate_type,
        purpose=cert.purpose,
        additional_details=cert.additional_details,
        status=cert.status,
        reviewer_id=cert.reviewer_id,
        reviewer_remarks=cert.reviewer_remarks,
        verification_code=cert.verification_code,
        document_url=cert.document_url,
        issued_at=cert.issued_at,
        created_at=cert.created_at,
    )
