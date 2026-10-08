"""
Transport bus routes, stops, schedules, and student bus passes.
"""
import uuid
from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Uuid

from app.database import Base


class BusRoute(Base):
    __tablename__ = "bus_routes"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    route_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    route_name: Mapped[str] = mapped_column(String(150), nullable=False)
    start_location: Mapped[str] = mapped_column(String(100), nullable=False)
    end_location: Mapped[str] = mapped_column(String(100), nullable=False)
    stops: Mapped[str] = mapped_column(Text, nullable=False)  # Comma-separated or JSON list of stops
    departure_time: Mapped[str] = mapped_column(String(20), nullable=False)  # e.g., "07:30 AM"
    arrival_time: Mapped[str] = mapped_column(String(20), nullable=False)    # e.g., "08:45 AM"
    bus_number: Mapped[str] = mapped_column(String(50), nullable=False)
    driver_name: Mapped[str] = mapped_column(String(100), nullable=False)
    driver_phone: Mapped[str] = mapped_column(String(25), nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, default=50, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    passes: Mapped[list["BusPass"]] = relationship("BusPass", back_populates="route")


class BusPass(Base):
    __tablename__ = "bus_passes"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    student_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("user_profiles.id", ondelete="CASCADE"), nullable=False, index=True
    )
    route_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("bus_routes.id", ondelete="CASCADE"), nullable=False
    )
    pass_code: Mapped[str] = mapped_column(
        String(50), unique=True, nullable=False, default=lambda: f"PASS-{uuid.uuid4().hex[:8].upper()}"
    )
    pickup_stop: Mapped[str] = mapped_column(String(100), nullable=False)
    valid_from: Mapped[date] = mapped_column(Date, nullable=False)
    valid_until: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="ACTIVE", nullable=False)  # ACTIVE, EXPIRED, CANCELLED
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    route: Mapped["BusRoute"] = relationship("BusRoute", back_populates="passes")
