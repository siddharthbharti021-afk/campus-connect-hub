"""
Pydantic schemas for Fee structures, invoices, and payments.
"""
import uuid
from datetime import date, datetime

from pydantic import BaseModel, Field


class FeeStructureCreate(BaseModel):
    department_id: uuid.UUID | None = None
    semester: int | None = Field(default=None, ge=1, le=8)
    academic_year: str = "2025-2026"
    category: str = Field(min_length=2, max_length=50)  # TUITION, HOSTEL, TRANSPORT, EXAM, MISC
    title: str = Field(min_length=3, max_length=200)
    amount: float = Field(gt=0)
    due_date: date
    is_mandatory: bool = True


class FeeStructureOut(BaseModel):
    id: uuid.UUID
    department_id: uuid.UUID | None
    semester: int | None
    academic_year: str
    category: str
    title: str
    amount: float
    due_date: date
    is_mandatory: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class FeePaymentCreate(BaseModel):
    invoice_id: uuid.UUID
    amount: float = Field(gt=0)
    payment_method: str = "UPI"  # UPI, CARD, NETBANKING


class FeePaymentOut(BaseModel):
    id: uuid.UUID
    invoice_id: uuid.UUID
    student_id: uuid.UUID
    amount: float
    payment_method: str
    transaction_ref: str
    receipt_number: str
    status: str
    paid_at: datetime

    model_config = {"from_attributes": True}


class FeeInvoiceOut(BaseModel):
    id: uuid.UUID
    student_id: uuid.UUID
    fee_structure_id: uuid.UUID
    title: str | None = None
    category: str | None = None
    total_amount: float
    paid_amount: float
    remaining_balance: float = 0.0
    status: str
    due_date: date
    created_at: datetime
    payments: list[FeePaymentOut] = []

    model_config = {"from_attributes": True}


class FeeSummaryOut(BaseModel):
    total_invoiced: float
    total_collected: float
    pending_amount: float
    total_students_with_dues: int
