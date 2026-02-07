"""Tests for modules/auth/service.py."""
import sys
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock

import pytest

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from modules.auth.exceptions import EmailAlreadyRegistered, InvalidCredentials
from modules.auth.repository import AuthRepository
from modules.auth.service import AuthService


class TestAuthServiceRegister:
    """Tests for the register method."""

    @pytest.fixture
    def service(self, mock_pool: MagicMock) -> AuthService:
        """Create service with mock repository."""
        repo = AuthRepository(mock_pool)
        return AuthService(repo)

    @pytest.mark.asyncio
    async def test_register_success(self, service: AuthService, mock_pool: MagicMock) -> None:
        """Registration should succeed and return message."""
        mock_pool.fetchrow = AsyncMock(return_value=MagicMock(id=1))

        result = await service.register("new@example.com", "password123")

        assert result == {"message": "Account created"}
        mock_pool.execute.assert_called_once()

    @pytest.mark.asyncio
    async def test_register_duplicate_email(self, service: AuthService, mock_pool: MagicMock) -> None:
        """Registration with duplicate email should raise exception."""
        import asyncpg
        mock_pool.fetchrow = AsyncMock(
            side_effect=asyncpg.UniqueViolationError("duplicate")
        )

        with pytest.raises(EmailAlreadyRegistered):
            await service.register("existing@example.com", "password123")


class TestAuthServiceLogin:
    """Tests for the login method."""

    @pytest.fixture
    def service(self, mock_pool: MagicMock) -> AuthService:
        """Create service with mock repository."""
        repo = AuthRepository(mock_pool)
        return AuthService(repo)

    @pytest.fixture
    def sample_user_record(self, sample_user_record: MagicMock) -> MagicMock:
        """Return sample user record."""
        return sample_user_record

    @pytest.mark.asyncio
    async def test_login_success(
        self,
        service: AuthService,
        mock_pool: MagicMock,
        sample_user_record: MagicMock,
    ) -> None:
        """Login with correct credentials should return tokens."""
        mock_pool.fetchrow = AsyncMock(return_value=sample_user_record)

        result = await service.login("test@example.com", "password123")

        assert "access_token" in result
        assert "refresh_token" in result
        assert "user" in result
        assert result["user"]["email"] == "test@example.com"
        assert result["user"]["id"] == 1

    @pytest.mark.asyncio
    async def test_login_invalid_email(self, service: AuthService, mock_pool: MagicMock) -> None:
        """Login with non-existent email should raise exception."""
        mock_pool.fetchrow = AsyncMock(return_value=None)

        with pytest.raises(InvalidCredentials):
            await service.login("nonexistent@example.com", "password123")

    @pytest.mark.asyncio
    async def test_login_invalid_password(
        self,
        service: AuthService,
        mock_pool: MagicMock,
        sample_user_record: MagicMock,
    ) -> None:
        """Login with wrong password should raise exception."""
        mock_pool.fetchrow = AsyncMock(return_value=sample_user_record)

        with pytest.raises(InvalidCredentials):
            await service.login("test@example.com", "wrongpassword")


class TestAuthServiceRefresh:
    """Tests for the refresh token method."""

    @pytest.fixture
    def service(self, mock_pool: MagicMock) -> AuthService:
        """Create service with mock repository."""
        repo = AuthRepository(mock_pool)
        return AuthService(repo)

    @pytest.mark.asyncio
    async def test_refresh_success(self, service: AuthService) -> None:
        """Refresh should return new access and refresh tokens."""
        from core.security import create_access_token, create_refresh_token

        # Create valid refresh token
        token_data = {"sub": "123", "email": "test@example.com"}
        refresh_token = create_refresh_token(token_data)

        result = await service.refresh(refresh_token)

        assert "access_token" in result
        assert "refresh_token" in result

    @pytest.mark.asyncio
    async def test_refresh_with_access_token_fails(self, service: AuthService) -> None:
        """Refresh with access token (not refresh) should fail."""
        from core.security import create_access_token

        access_token = create_access_token({"sub": "123", "email": "test@example.com"})

        with pytest.raises(InvalidCredentials):
            await service.refresh(access_token)
