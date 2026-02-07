"""Pytest configuration and fixtures."""
import asyncio
import sys
from pathlib import Path
from typing import Iterator
from unittest.mock import AsyncMock, MagicMock

import pytest

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from core.security import hash_password


@pytest.fixture(scope="session")
def event_loop() -> Iterator[asyncio.AbstractEventLoop]:
    """Create event loop for async tests."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def mock_pool() -> MagicMock:
    """Create a mock database pool."""
    pool = MagicMock()
    pool.fetchrow = AsyncMock()
    pool.fetch = AsyncMock()
    pool.execute = AsyncMock()
    return pool


@pytest.fixture
def sample_user() -> dict:
    """Sample user data for testing."""
    return {
        "id": 1,
        "email": "test@example.com",
        "password_hash": hash_password("password123"),
        "created_at": "2024-01-01T00:00:00Z",
    }


@pytest.fixture
def sample_user_record(sample_user) -> MagicMock:
    """Sample database record."""
    record = MagicMock()
    record["id"] = sample_user["id"]
    record["email"] = sample_user["email"]
    record["password_hash"] = sample_user["password_hash"]
    record["created_at"] = sample_user["created_at"]
    return record
