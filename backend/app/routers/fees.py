"""
Fees & Payment router with strict RBAC and data scoping for CampusOS.
"""
import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.dependencies import CurrentUser
from app.models.fees import FeeInvoice, FeePayment, FeeStructure
from app.models.parent import ParentStudentLink
from app.rbac import require_role
from app.schemas.fees import (
    FeeInvoiceOut,
    FeePaymentCreate,
    FeePaymentOut,
    FeeStructureCreate,
    FeeStructureOut,
    FeeSummaryOut,
)

router = APIRouter(prefix="/fees", tags=["fees"])
DB = Annotated[AsyncSession, Depends(get_db)]


@router.get("/my-invoices", response_model=list[FeeInvoiceOut])
@router.get("/invoices/me", response_model=list[FeeInvoiceOut])
async def get_my_invoices(
    current_user: CurrentUser,
    db: DB,
):
    """
    Fetch fee invoices for the logged-in user:
    - STUDENT: returns their own invoices.
    - PARENT: returns invoices for all linked children.
    - DEAN/ADMIN: returns all campus invoices.
    """
    if current_user.role in ("ACADEMIC_ADMIN", "SUPER_ADMIN"):
        query = (
            select(FeeInvoice)
            .options(selectinload(FeeInvoice.fee_structure), selectinload(FeeInvoice.payments))
            .order_by(FeeInvoice.due_date.asc())
        )
    elif current_user.role == "PARENT":
        links_res = await db.execute(
            select(ParentStudentLink.student_id).where(ParentStudentLink.parent_id == current_user.id)
        )
        linked_student_ids = list(links_res.scalars().all())
        if not linked_student_ids:
            return []
        query = (
            select(FeeInvoice)
            .where(FeeInvoice.student_id.in_(linked_student_ids))
            .options(selectinload(FeeInvoice.fee_structure), selectinload(FeeInvoice.payments))
            .order_by(FeeInvoice.due_date.asc())
        )
    else:  # STUDENT or FACULTY
        query = (
            select(FeeInvoice)
            .where(FeeInvoice.student_id == current_user.id)
            .options(selectinload(FeeInvoice.fee_structure), selectinload(FeeInvoice.payments))
            .order_by(FeeInvoice.due_date.asc())
        )

    result = await db.execute(query)
    invoices = result.scalars().all()

    output = []
    for inv in invoices:
        remaining = max(0.0, round(inv.total_amount - inv.paid_amount, 2))
        inv_data = FeeInvoiceOut(
            id=inv.id,
            student_id=inv.student_id,
            fee_structure_id=inv.fee_structure_id,
            title=inv.fee_structure.title if inv.fee_structure else "Campus Fee",
            category=inv.fee_structure.category if inv.fee_structure else "GENERAL",
            total_amount=inv.total_amount,
            paid_amount=inv.paid_amount,
            remaining_balance=remaining,
            status=inv.status,
            due_date=inv.due_date,
            created_at=inv.created_at,
            payments=[FeePaymentOut.model_validate(p) for p in inv.payments],
        )
        output.append(inv_data)

    return output


@router.get("/invoices/student/{student_id}", response_model=list[FeeInvoiceOut])
async def get_student_invoices(
    student_id: uuid.UUID,
    current_user: CurrentUser,
    db: DB,
):
    """
    Fetch invoices for a specific student_id with strict access control:
    - STUDENT: allowed only if student_id == current_user.id. Else 403.
    - PARENT: allowed only if student_id is a linked child. Else 403.
    - DEAN/FACULTY: allowed.
    """
    if current_user.role == "STUDENT" and current_user.id != student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Cannot view another student's fee invoices",
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

    query = (
        select(FeeInvoice)
        .where(FeeInvoice.student_id == student_id)
        .options(selectinload(FeeInvoice.fee_structure), selectinload(FeeInvoice.payments))
        .order_by(FeeInvoice.due_date.asc())
    )
    result = await db.execute(query)
    invoices = result.scalars().all()

    return [
        FeeInvoiceOut(
            id=inv.id,
            student_id=inv.student_id,
            fee_structure_id=inv.fee_structure_id,
            title=inv.fee_structure.title if inv.fee_structure else "Campus Fee",
            category=inv.fee_structure.category if inv.fee_structure else "GENERAL",
            total_amount=inv.total_amount,
            paid_amount=inv.paid_amount,
            remaining_balance=max(0.0, round(inv.total_amount - inv.paid_amount, 2)),
            status=inv.status,
            due_date=inv.due_date,
            created_at=inv.created_at,
            payments=[FeePaymentOut.model_validate(p) for p in inv.payments],
        )
        for inv in invoices
    ]


@router.post("/pay", response_model=FeePaymentOut)
@router.post("/invoices/{invoice_id}/pay", response_model=FeePaymentOut)
async def make_payment(
    invoice_id: uuid.UUID | None = None,
    body: FeePaymentCreate | None = None,
    current_user: CurrentUser = None,
    db: DB = None,
):
    """Process a fee payment for an authorized student or linked parent."""
    target_invoice_id = body.invoice_id if body else invoice_id
    if not target_invoice_id:
        raise HTTPException(status_code=400, detail="Missing invoice_id")

    inv_res = await db.execute(select(FeeInvoice).where(FeeInvoice.id == target_invoice_id))
    invoice = inv_res.scalar_one_or_none()
    if not invoice:
        raise HTTPException(status_code=404, detail="Fee invoice not found")

    # Access check: student or linked parent
    if current_user.role == "STUDENT" and invoice.student_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to pay this invoice")

    if current_user.role == "PARENT":
        link_res = await db.execute(
            select(ParentStudentLink).where(
                ParentStudentLink.parent_id == current_user.id,
                ParentStudentLink.student_id == invoice.student_id,
            )
        )
        if not link_res.scalar_one_or_none():
            raise HTTPException(status_code=403, detail="Not authorized to pay for unlinked student")

    remaining = invoice.total_amount - invoice.paid_amount
    if remaining <= 0:
        raise HTTPException(status_code=400, detail="This invoice is already fully paid")

    pay_amount = body.amount if body and body.amount > 0 else remaining
    pay_amount = min(pay_amount, remaining)
    invoice.paid_amount += pay_amount

    if invoice.paid_amount >= invoice.total_amount:
        invoice.status = "PAID"
    else:
        invoice.status = "PARTIAL"

    txn_ref = f"TXN-{uuid.uuid4().hex[:10].upper()}"
    rcpt_num = f"RCPT-{uuid.uuid4().hex[:8].upper()}"

    payment = FeePayment(
        invoice_id=invoice.id,
        student_id=invoice.student_id,
        amount=pay_amount,
        payment_method=body.payment_method if body else "ONLINE_CARD",
        transaction_ref=txn_ref,
        receipt_number=rcpt_num,
        status="SUCCESS",
    )
    db.add(payment)
    await db.commit()
    await db.refresh(payment)

    return FeePaymentOut.model_validate(payment)


@router.get("/structures", response_model=list[FeeStructureOut])
async def list_fee_structures(
    current_user: CurrentUser,
    db: DB,
):
    """List fee structures."""
    res = await db.execute(select(FeeStructure).order_by(FeeStructure.created_at.desc()))
    return [FeeStructureOut.model_validate(s) for s in res.scalars().all()]


@router.get("/receipt/{receipt_number}", response_model=FeePaymentOut)
async def get_receipt(
    receipt_number: str,
    current_user: CurrentUser,
    db: DB,
):
    """Fetch receipt details by receipt_number."""
    res = await db.execute(
        select(FeePayment).where(FeePayment.receipt_number == receipt_number)
    )
    payment = res.scalar_one_or_none()
    if not payment:
        raise HTTPException(status_code=404, detail="Receipt not found")

    # Enforce data scoping
    if current_user.role == "STUDENT" and payment.student_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    return FeePaymentOut.model_validate(payment)


@router.get(
    "/admin/summary",
    response_model=FeeSummaryOut,
    dependencies=[Depends(require_role("ACADEMIC_ADMIN", "SUPER_ADMIN"))],
)
async def get_fee_summary(
    current_user: CurrentUser,
    db: DB,
):
    """Admin dashboard overview of institution-wide financials."""
    invoices = (await db.execute(select(FeeInvoice))).scalars().all()
    total_inv = sum(i.total_amount for i in invoices)
    total_col = sum(i.paid_amount for i in invoices)
    pending = max(0.0, total_inv - total_col)
    students_with_dues = len(set(i.student_id for i in invoices if i.status != "PAID"))

    return FeeSummaryOut(
        total_invoiced=round(total_inv, 2),
        total_collected=round(total_col, 2),
        pending_amount=round(pending, 2),
        total_students_with_dues=students_with_dues,
    )


@router.post(
    "/admin/structures",
    response_model=FeeStructureOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_role("ACADEMIC_ADMIN", "SUPER_ADMIN"))],
)
async def create_fee_structure(
    body: FeeStructureCreate,
    current_user: CurrentUser,
    db: DB,
):
    """Admin endpoint to create a new fee structure."""
    fee_struct = FeeStructure(
        department_id=body.department_id,
        semester=body.semester,
        academic_year=body.academic_year,
        category=body.category.upper(),
        title=body.title,
        amount=body.amount,
        due_date=body.due_date,
        is_mandatory=body.is_mandatory,
    )
    db.add(fee_struct)
    await db.commit()
    await db.refresh(fee_struct)
    return FeeStructureOut.model_validate(fee_struct)
