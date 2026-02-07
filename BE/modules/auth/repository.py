"""Auth repository — thin SQL wrapper over asyncpg.

One method per query.  Returns domain models, never raw ``asyncpg.Record``.
"""

from __future__ import annotations

import asyncpg

from modules.auth.models import User


class AuthRepository:
    """Data-access layer for the ``users`` table."""

    def __init__(self, pool: asyncpg.Pool) -> None:
        self._pool = pool

    # ── Queries ───────────────────────────────────────────────────────

    async def get_by_email(self, email: str) -> User | None:
        """Return a user by email, or ``None`` if not found."""
        row = await self._pool.fetchrow(
            "SELECT id, email, password_hash, created_at FROM users WHERE email = $1",
            email,
        )
        if row is None:
            return None
        return User(
            id=row["id"],
            email=row["email"],
            password_hash=row["password_hash"],
            created_at=row["created_at"],
        )

    # ── Commands ──────────────────────────────────────────────────────

    async def create_user(self, email: str, password_hash: str) -> int:
        """Insert a new user and return the generated ``id``.

        Raises :class:`asyncpg.UniqueViolationError` if the email is taken.
        """
        row = await self._pool.fetchrow(
            "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id",
            email,
            password_hash,
        )
        return row["id"]
