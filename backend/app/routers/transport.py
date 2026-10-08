"""
Transport & Campus Bus logistics router with RBAC and role-scoped pass retrieval.
"""
import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.dependencies import CurrentUser
from app.models.parent import ParentStudentLink
from app.models.transport import BusPass, BusRoute
from app.rbac import require_role
from app.schemas.transport import (
    BusPassApplyRequest,
    BusPassOut,
    BusRouteCreate,
    BusRouteOut,
)

router = APIRouter(prefix="/transport", tags=["transport"])
DB = Annotated[AsyncSession, Depends(get_db)]


@router.get("/routes", response_model=list[BusRouteOut])
async def list_routes(
    current_user: CurrentUser,
    db: DB,
):
    """List active campus bus routes, stops, and schedules."""
    res = await db.execute(select(BusRoute).where(BusRoute.is_active == True))
    routes = res.scalars().all()
    return [BusRouteOut.model_validate(r) for r in routes]


@router.get("/my-pass", response_model=BusPassOut | None)
@router.get("/pass/me", response_model=BusPassOut | None)
async def get_my_bus_pass(
    current_user: CurrentUser,
    db: DB,
):
    """
    Fetch bus pass for logged-in user:
    - STUDENT: their active bus pass.
    - PARENT: active bus pass for their first linked student.
    - DEAN/ADMIN: active pass.
    """
    if current_user.role == "PARENT":
        links_res = await db.execute(
            select(ParentStudentLink.student_id).where(ParentStudentLink.parent_id == current_user.id)
        )
        linked_ids = list(links_res.scalars().all())
        if not linked_ids:
            return None
        res = await db.execute(
            select(BusPass)
            .where(BusPass.student_id.in_(linked_ids), BusPass.status == "ACTIVE")
            .options(selectinload(BusPass.route))
            .order_by(BusPass.created_at.desc())
        )
    else:
        res = await db.execute(
            select(BusPass)
            .where(BusPass.student_id == current_user.id, BusPass.status == "ACTIVE")
            .options(selectinload(BusPass.route))
            .order_by(BusPass.created_at.desc())
        )

    b_pass = res.scalar_one_or_none()
    if not b_pass:
        return None

    return BusPassOut(
        id=b_pass.id,
        student_id=b_pass.student_id,
        route_id=b_pass.route_id,
        pass_code=b_pass.pass_code,
        pickup_stop=b_pass.pickup_stop,
        valid_from=b_pass.valid_from,
        valid_until=b_pass.valid_until,
        status=b_pass.status,
        route_number=b_pass.route.route_number if b_pass.route else None,
        route_name=b_pass.route.route_name if b_pass.route else None,
        bus_number=b_pass.route.bus_number if b_pass.route else None,
        created_at=b_pass.created_at,
    )


@router.get("/pass/student/{student_id}", response_model=BusPassOut | None)
async def get_student_bus_pass(
    student_id: uuid.UUID,
    current_user: CurrentUser,
    db: DB,
):
    """
    Fetch bus pass for a specific student_id with RBAC check:
    - STUDENT: allowed only if student_id == current_user.id. Else 403.
    - PARENT: allowed only if student_id is linked to parent. Else 403.
    - DEAN/FACULTY: allowed.
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
        select(BusPass)
        .where(BusPass.student_id == student_id, BusPass.status == "ACTIVE")
        .options(selectinload(BusPass.route))
        .order_by(BusPass.created_at.desc())
    )
    b_pass = res.scalar_one_or_none()
    if not b_pass:
        return None

    return BusPassOut(
        id=b_pass.id,
        student_id=b_pass.student_id,
        route_id=b_pass.route_id,
        pass_code=b_pass.pass_code,
        pickup_stop=b_pass.pickup_stop,
        valid_from=b_pass.valid_from,
        valid_until=b_pass.valid_until,
        status=b_pass.status,
        route_number=b_pass.route.route_number if b_pass.route else None,
        route_name=b_pass.route.route_name if b_pass.route else None,
        bus_number=b_pass.route.bus_number if b_pass.route else None,
        created_at=b_pass.created_at,
    )


@router.post("/apply-pass", response_model=BusPassOut, status_code=status.HTTP_201_CREATED)
async def apply_bus_pass(
    body: BusPassApplyRequest,
    current_user: CurrentUser,
    db: DB,
):
    """Apply for a new campus bus pass."""
    route_res = await db.execute(select(BusRoute).where(BusRoute.id == body.route_id))
    route = route_res.scalar_one_or_none()
    if not route:
        raise HTTPException(status_code=404, detail="Selected bus route not found")

    new_pass = BusPass(
        student_id=current_user.id,
        route_id=body.route_id,
        pass_code=f"PASS-{uuid.uuid4().hex[:8].upper()}",
        pickup_stop=body.pickup_stop,
        valid_from=body.valid_from,
        valid_until=body.valid_until,
        status="ACTIVE",
    )
    db.add(new_pass)
    await db.commit()
    await db.refresh(new_pass)

    return BusPassOut(
        id=new_pass.id,
        student_id=new_pass.student_id,
        route_id=new_pass.route_id,
        pass_code=new_pass.pass_code,
        pickup_stop=new_pass.pickup_stop,
        valid_from=new_pass.valid_from,
        valid_until=new_pass.valid_until,
        status=new_pass.status,
        route_number=route.route_number,
        route_name=route.route_name,
        bus_number=route.bus_number,
        created_at=new_pass.created_at,
    )


@router.post(
    "/admin/routes",
    response_model=BusRouteOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_role("ACADEMIC_ADMIN", "SUPER_ADMIN"))],
)
async def create_route(
    body: BusRouteCreate,
    current_user: CurrentUser,
    db: DB,
):
    """Admin registers a new campus bus route."""
    route = BusRoute(
        route_number=body.route_number,
        route_name=body.route_name,
        start_location=body.start_location,
        end_location=body.end_location,
        stops=body.stops,
        departure_time=body.departure_time,
        arrival_time=body.arrival_time,
        bus_number=body.bus_number,
        driver_name=body.driver_name,
        driver_phone=body.driver_phone,
        capacity=body.capacity,
    )
    db.add(route)
    await db.commit()
    await db.refresh(route)
    return BusRouteOut.model_validate(route)
