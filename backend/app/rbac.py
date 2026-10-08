"""
Role-Based Access Control (RBAC) dependencies.
Validates JWT tokens and enforces role restrictions for protected endpoints.
"""
import uuid
import logging
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_access_token
from app.database import get_db
from app.models.user import UserProfile

logger = logging.getLogger(__name__)
bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> UserProfile:
    """
    Dependency that validates the JWT token from the Authorization header.
    Returns the UserProfile if valid, or raises HTTP 401 Unauthorized.
    """
    if credentials is None or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    try:
        payload = decode_access_token(token)
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except Exception as e:
        logger.warning(f"JWT validation failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Fetch user from database
    try:
        try:
            uid = uuid.UUID(user_id)
            query = select(UserProfile).where(UserProfile.id == uid)
        except ValueError:
            query = select(UserProfile).where(UserProfile.user_code == user_id)

        result = await db.execute(query)
        user = result.scalar_one_or_none()
    except Exception as e:
        logger.error(f"Database error during user lookup: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database lookup error",
        )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authenticated user no longer exists",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


async def get_user_role_names(user: UserProfile) -> list[str]:
    """Return list of role names for a user."""
    if user.role:
        return [user.role]
    return ["STUDENT"]


def require_role(*roles: str):
    """
    Dependency generator that checks if the authenticated user has one of the allowed roles.
    Raises HTTP 403 Forbidden if the user's role is not permitted.
    """
    async def _check_role(
        current_user: Annotated[UserProfile, Depends(get_current_user)],
    ) -> UserProfile:
        allowed = [r.upper() for r in roles]
        user_role = current_user.role.upper() if current_user.role else "STUDENT"

        if user_role not in allowed and "SUPER_ADMIN" not in user_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Requires one of roles: {', '.join(roles)}",
            )
        return current_user

    return _check_role
