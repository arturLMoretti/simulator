"""Async PostgreSQL connection pool lifecycle."""

from __future__ import annotations

import asyncpg

from config import settings

# Module-level pool reference — set during app lifespan.
pool: asyncpg.Pool | None = None


async def create_pool() -> asyncpg.Pool:
    """Create and return an asyncpg connection pool."""
    global pool
    pool = await asyncpg.create_pool(
        host=settings.db_host,
        port=settings.db_port,
        database=settings.db_name,
        user=settings.db_user,
        password=settings.db_password,
        min_size=settings.db_pool_min,
        max_size=settings.db_pool_max,
    )
    return pool


async def close_pool() -> None:
    """Gracefully close the connection pool."""
    global pool
    if pool:
        await pool.close()
        pool = None


def get_pool() -> asyncpg.Pool:
    """Return the current pool.  Raises if not initialised."""
    if pool is None:
        raise RuntimeError("Database pool is not initialised — call create_pool() first")
    return pool
