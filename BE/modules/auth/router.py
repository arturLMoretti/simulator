"""Auth HTTP router — thin layer that validates input and delegates to the service.

No business logic here.  The router only knows about schemas and the service.
"""

from fastapi import APIRouter

from core.database import get_pool
from modules.auth.repository import AuthRepository
from modules.auth.schemas import (
    AuthRequest,
    MessageResponse,
    RefreshTokenRequest,
    TokenResponse,
)
from modules.auth.service import AuthService

router = APIRouter(prefix="/api", tags=["auth"])


def _get_service() -> AuthService:
    """Build the service with its dependencies.

    In a full DI setup this would come from a container; for now we wire
    manually so the architecture is clear.
    """
    pool = get_pool()
    repo = AuthRepository(pool)
    return AuthService(repo)


@router.post("/register", response_model=MessageResponse, status_code=201)
async def register(body: AuthRequest):
    service = _get_service()
    return await service.register(body.email, body.password)


@router.post("/login", response_model=TokenResponse)
async def login(body: AuthRequest):
    service = _get_service()
    result = await service.login(body.email, body.password)
    return TokenResponse(
        access_token=result["access_token"],
        refresh_token=result["refresh_token"]
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh(body: RefreshTokenRequest):
    service = _get_service()
    result = await service.refresh(body.refresh_token)
    return TokenResponse(
        access_token=result["access_token"],
        refresh_token=result["refresh_token"]
    )
