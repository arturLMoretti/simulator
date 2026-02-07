"""Tests for modules/auth/schemas.py."""
import sys
from pathlib import Path

from pydantic import ValidationError

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from modules.auth.schemas import (
    AuthRequest,
    MessageResponse,
    RefreshTokenRequest,
    TokenResponse,
    UserResponse,
)


class TestAuthRequestSchema:
    """Tests for AuthRequest schema."""

    def test_valid_request(self) -> None:
        """Valid email and password should create request."""
        request = AuthRequest(email="test@example.com", password="password123")

        assert request.email == "test@example.com"
        assert request.password == "password123"

    def test_invalid_email(self) -> None:
        """Invalid email should raise validation error."""
        with pytest.raises(ValidationError):
            AuthRequest(email="invalid-email", password="password123")

    def test_empty_password(self) -> None:
        """Empty password should raise validation error."""
        with pytest.raises(ValidationError):
            AuthRequest(email="test@example.com", password="")


class TestTokenResponseSchema:
    """Tests for TokenResponse schema."""

    def test_token_response(self) -> None:
        """Token response should be created with defaults."""
        response = TokenResponse(
            access_token="eyJ...",
            refresh_token="eyJ...",
        )

        assert response.access_token == "eyJ..."
        assert response.refresh_token == "eyJ..."
        assert response.token_type == "bearer"

    def test_custom_token_type(self) -> None:
        """Token type can be customized."""
        response = TokenResponse(
            access_token="eyJ...",
            refresh_token="eyJ...",
            token_type="custom",
        )

        assert response.token_type == "custom"


class TestUserResponseSchema:
    """Tests for UserResponse schema."""

    def test_user_response(self) -> None:
        """User response should contain user data."""
        user = UserResponse(id=1, email="test@example.com")

        assert user.id == 1
        assert user.email == "test@example.com"


class TestRefreshTokenRequestSchema:
    """Tests for RefreshTokenRequest schema."""

    def test_refresh_token_request(self) -> None:
        """Refresh token request should be created."""
        request = RefreshTokenRequest(refresh_token="eyJ...")

        assert request.refresh_token == "eyJ..."


class TestMessageResponseSchema:
    """Tests for MessageResponse schema."""

    def test_message_response(self) -> None:
        """Message response should contain message."""
        response = MessageResponse(message="Success!")

        assert response.message == "Success!"
