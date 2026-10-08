"""
Fee structures, student fee invoices, and payment receipt models.
"""
import uuid
from datetime import date, datetime
from typing import Optional

from sqlalchemy import Boolean, Date, DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Uuid

from app.database import Base


class FeeStructure(Base):
    __tablename__ = "fee_structures"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    department_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("departments.id", ondelete="SET NULL"), nullable=True
    )
    semester: Mapped[int | None] = mapped_column(Integer, nullable=True)
    academic_year: Mapped[str] = mapped_column(String(20), nullable=False, default="2025-2026")
    category: Mapped[str] = mapped_column(String(50), nullable=False)  # TUITION, HOSTEL, TRANSPORT, EXAM, MISC
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    due_date: Mapped[date] = mapped_column(Date, nullable=False)
    is_mandatory: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    invoices: Mapped[list["FeeInvoice"]] = relationship("FeeInvoice", back_populates="fee_structure")


class FeeInvoice(Base):
    __tablename__ = "fee_invoices"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    student_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("user_profiles.id", ondelete="CASCADE"), nullable=False, index=True
    )
    fee_structure_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("fee_structures.id", ondelete="CASCADE"), nullable=False
    )
    total_amount: Mapped[float] = mapped_column(Float, nullable=False)
    paid_amount: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="PENDING", nullable=False)  # PENDING, PARTIAL, PAID, OVERDUE
    due_date: Mapped[date] = mapped_column(Date, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    fee_structure: Mapped["FeeStructure"] = relationship("FeeStructure", back_populates="invoices")
    payments: Mapped[list["FeePayment"]] = relationship("FeePayment", back_populates="invoice")


class FeePayment(Base):
    __tablename__ = "fee_payments"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    invoice_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("fee_invoices.id", ondelete="CASCADE"), nullable=False, index=True
    )
    student_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("user_profiles.id", ondelete="CASCADE"), nullable=False, index=True
    )
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    payment_method: Mapped[str] = mapped_column(String(50), nullable=False)  # UPI, CARD, NETBANKING
    transaction_ref: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    receipt_number: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(30), default="SUCCESS", nullable=False)
    paid_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    invoice: Mapped["FeeInvoice"] = relationship("FeeInvoice", back_populates="payments")
