"""Auth service — business logic / use cases.

Pure Python — no HTTP or SQL.  Receives plain objects, returns domain models.
"""

from __future__ import annotations

import asyncpg

from core.events import event_bus
from core.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
)
from modules.auth import events as auth_events
from modules.auth.exceptions import EmailAlreadyRegistered, InvalidCredentials
from modules.auth.repository import AuthRepository


class AuthService:
    """Orchestrates authentication use cases."""

    def __init__(self, repo: AuthRepository) -> None:
        self._repo = repo

    # ── Use cases ─────────────────────────────────────────────────────

    async def register(self, email: str, password: str) -> dict:
        """Create a new user account.

        Returns a dict with ``message`` on success.
        Raises :class:`EmailAlreadyRegistered` if the email is taken.
        """
        hashed = hash_password(password)

        try:
            user_id = await self._repo.create_user(email, hashed)
        except asyncpg.UniqueViolationError:
            raise EmailAlreadyRegistered()

        # Fire-and-forget domain event
        await event_bus.publish(
            auth_events.USER_REGISTERED,
            {"user_id": user_id, "email": email},
        )

        return {"message": "Account created"}

    async def login(self, email: str, password: str) -> dict:
        """Authenticate a user.

        Returns a dict with ``access_token``, ``refresh_token``, and user info.
        Raises :class:`InvalidCredentials` if email/password don't match.
        """
        user = await self._repo.get_by_email(email)

        if user is None or not verify_password(password, user.password_hash):
            raise InvalidCredentials()

        # Generate JWT tokens
        token_data = {"sub": str(user.id), "email": user.email}
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)

        await event_bus.publish(
            auth_events.USER_LOGGED_IN,
            {"user_id": user.id, "email": user.email},
        )

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {"id": user.id, "email": user.email}
        }

    async def refresh(self, refresh_token: str) -> dict:
        """Refresh access token using a valid refresh token.

        Returns new access and refresh tokens.
        Raises jwt.PyJWTError if token is invalid or expired.
        """
        from core.security import verify_token
        
        payload = verify_token(refresh_token)
        if payload.get("type") != "refresh":
            raise InvalidCredentials()

        user_id = int(payload.get("sub"))
        email = payload.get("email")

        # Generate new tokens
        token_data = {"sub": str(user_id), "email": email}
        access_token = create_access_token(token_data)
        new_refresh_token = create_refresh_token(token_data)

        return {
            "access_token": access_token,
            "refresh_token": new_refresh_token,
        }
