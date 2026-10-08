"""
Security utilities: Password hashing (bcrypt) and signed JWT token creation/verification.
"""
from datetime import datetime, timedelta, timezone
import bcrypt
import jwt
from app.config import settings


def hash_password(password: str) -> str:
    """Hash a plaintext password using bcrypt."""
    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str | None) -> bool:
    """Verify a plaintext password against its bcrypt hash."""
    if not hashed_password:
        return False
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8")
        )
    except Exception:
        return False


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Create a signed JWT token with payload, user id, role, and expiration."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> dict:
    """Decode and verify a signed JWT token using the configured secret key."""
    return jwt.decode(
        token,
        settings.JWT_SECRET,
        algorithms=[settings.JWT_ALGORITHM],
        options={"verify_exp": True},
    )


# Backwards compatibility helpers
def create_simple_token(user_id: str, email: str, role: str = "STUDENT") -> str:
    return create_access_token({"sub": user_id, "email": email, "role": role})


def verify_simple_token(token: str) -> dict:
    return decode_access_token(token)


def verify_supabase_token(token: str) -> dict:
    return decode_access_token(token)
