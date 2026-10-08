"""
Authentication Router for CampusOS.
Supports login with user_id / email + bcrypt password, signed JWT issuance, and session retrieval.
"""
import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import create_access_token, hash_password, verify_password
from app.database import get_db
from app.models.academic import Department
from app.models.user import UserProfile
from app.rbac import get_current_user
from app.schemas.auth import UserProfileOut

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
    user_id: str  # Can be user_code (e.g. student01, prof01, dean01, parent01) or email
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfileOut


class RegisterRequest(BaseModel):
    user_code: str
    email: EmailStr
    password: str
    full_name: str
    role: str = "student"  # student, admin, professor, parent


@router.post("/login", response_model=LoginResponse)
async def login(
    body: LoginRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> LoginResponse:
    """
    Authenticate user via User ID / Email + password against bcrypt hash.
    Returns a signed JWT access token.
    """
    user_input = body.user_id.strip()

    # Find user by user_code OR email
    result = await db.execute(
        select(UserProfile).where(
            or_(
                UserProfile.user_code == user_input,
                UserProfile.email == user_input.lower(),
            )
        )
    )
    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid User ID/email or password",
        )

    # Verify bcrypt password
    if not verify_password(body.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid User ID/email or password",
        )

    # Generate signed JWT
    token = create_access_token(
        {
            "sub": str(user.id),
            "email": user.email,
            "user_code": user.user_code,
            "role": user.role,
        }
    )

    user_out = UserProfileOut.model_validate(user)
    user_out.roles = [user.role]

    return LoginResponse(
        access_token=token,
        token_type="bearer",
        user=user_out,
    )


@router.post("/register", response_model=LoginResponse)
async def register(
    body: RegisterRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> LoginResponse:
    """Register a new user with hashed password."""
    # Check if user_code or email exists
    result = await db.execute(
        select(UserProfile).where(
            or_(
                UserProfile.user_code == body.user_code,
                UserProfile.email == body.email,
            )
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="User ID or Email already registered")

    role_map = {
        "student": "STUDENT",
        "admin": "ACADEMIC_ADMIN",
        "dean": "ACADEMIC_ADMIN",
        "professor": "FACULTY",
        "faculty": "FACULTY",
        "parent": "PARENT",
        "guardian": "PARENT",
    }
    role = role_map.get(body.role.lower(), "STUDENT")

    dept_result = await db.execute(select(Department).limit(1))
    dept = dept_result.scalar_one_or_none()

    profile = UserProfile(
        id=uuid.uuid4(),
        user_code=body.user_code,
        email=body.email,
        password_hash=hash_password(body.password),
        full_name=body.full_name,
        role=role,
        is_demo=False,
        department_id=dept.id if dept else None,
    )
    db.add(profile)
    await db.commit()
    await db.refresh(profile)

    token = create_access_token(
        {
            "sub": str(profile.id),
            "email": profile.email,
            "user_code": profile.user_code,
            "role": profile.role,
        }
    )

    user_out = UserProfileOut.model_validate(profile)
    user_out.roles = [profile.role]

    return LoginResponse(
        access_token=token,
        token_type="bearer",
        user=user_out,
    )


@router.get("/me", response_model=UserProfileOut)
async def me(current_user: Annotated[UserProfile, Depends(get_current_user)]) -> UserProfileOut:
    """Return the currently authenticated user's profile."""
    out = UserProfileOut.model_validate(current_user)
    out.roles = [current_user.role]
    return out


@router.post("/logout")
async def logout(current_user: Annotated[UserProfile, Depends(get_current_user)]):
    """Log out the current user session."""
    return {"message": "Logged out successfully", "user_id": str(current_user.id)}
