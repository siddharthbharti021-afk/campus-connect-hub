"""
Pydantic schemas for Bus routes, schedules, and student bus passes.
"""
import uuid
from datetime import date, datetime

from pydantic import BaseModel, Field


class BusRouteCreate(BaseModel):
    route_number: str = Field(min_length=2, max_length=50)
    route_name: str = Field(min_length=3, max_length=150)
    start_location: str
    end_location: str
    stops: str
    departure_time: str
    arrival_time: str
    bus_number: str
    driver_name: str
    driver_phone: str
    capacity: int = 50


class BusRouteOut(BaseModel):
    id: uuid.UUID
    route_number: str
    route_name: str
    start_location: str
    end_location: str
    stops: str
    departure_time: str
    arrival_time: str
    bus_number: str
    driver_name: str
    driver_phone: str
    capacity: int
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class BusPassApplyRequest(BaseModel):
    route_id: uuid.UUID
    pickup_stop: str = Field(min_length=2, max_length=100)
    valid_from: date
    valid_until: date


class BusPassOut(BaseModel):
    id: uuid.UUID
    student_id: uuid.UUID
    route_id: uuid.UUID
    pass_code: str
    pickup_stop: str
    valid_from: date
    valid_until: date
    status: str
    route_number: str | None = None
    route_name: str | None = None
    bus_number: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}
