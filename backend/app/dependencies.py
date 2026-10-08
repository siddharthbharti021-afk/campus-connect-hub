"""
FastAPI dependency injection utilities.
Re-exports core RBAC dependencies from app.rbac for unified dependency injection.
"""
from typing import Annotated
from fastapi import Depends
from app.models.user import UserProfile
from app.rbac import get_current_user, get_user_role_names, require_role

# Pre-built type aliases & dependencies
CurrentUser = Annotated[UserProfile, Depends(get_current_user)]
SuperAdmin = Annotated[UserProfile, Depends(require_role("SUPER_ADMIN"))]
AcademicWrite = Annotated[UserProfile, Depends(require_role("SUPER_ADMIN", "ACADEMIC_ADMIN"))]
HostelWrite = Annotated[UserProfile, Depends(require_role("SUPER_ADMIN", "HOSTEL_ADMIN", "HOSTEL_COORDINATOR"))]
MessWrite = Annotated[UserProfile, Depends(require_role("SUPER_ADMIN", "HOSTEL_ADMIN", "MESS_ADMIN"))]
PlacementWrite = Annotated[UserProfile, Depends(require_role("SUPER_ADMIN", "ACADEMIC_ADMIN", "PLACEMENT_ADMIN", "PLACEMENT_COORDINATOR"))]
ClubWrite = Annotated[UserProfile, Depends(require_role("SUPER_ADMIN", "CLUB_ADMIN", "CLUB_COORDINATOR"))]
FacultyWrite = Annotated[UserProfile, Depends(require_role("SUPER_ADMIN", "FACULTY"))]
