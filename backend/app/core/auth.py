from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import httpx

from app.core.config import settings

bearer_scheme = HTTPBearer()


async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> str:
    """Verify Clerk JWT and return the user's Clerk ID (sub claim)."""
    token = credentials.credentials
    try:
        # Clerk JWTs are RS256; verify using the public key or JWKS endpoint
        # In production, fetch JWKS from Clerk and cache it
        payload = jwt.decode(
            token,
            settings.CLERK_JWT_VERIFICATION_KEY,
            algorithms=["RS256"],
            options={"verify_aud": False},
        )
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate token")
