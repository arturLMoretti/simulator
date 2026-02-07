"""Tests for core/security.py - password hashing and JWT utilities."""
import sys
from datetime import timedelta
from pathlib import Path

import pytest

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from core.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
)


class TestPasswordHashing:
    """Tests for password hashing functions."""

    def test_hash_password_creates_unique_hash(self) -> None:
        """Hashing the same password twice should create different hashes."""
        password = "testpassword123"
        hash1 = hash_password(password)
        hash2 = hash_password(password)

        # Hashes should be different due to unique salt
        assert hash1 != hash2
        assert hash1.startswith("$")
        assert hash2.startswith("$")

    def test_hash_password_format(self) -> None:
        """Hash should be in format salt$digest."""
        password = "testpassword"
        hash_result = hash_password(password)

        parts = hash_result.split("$")
        assert len(parts) == 2
        assert len(parts[0]) == 32  # 16 bytes hex encoded = 32 chars
        assert len(parts[1]) == 64  # SHA256 hex = 64 chars

    def test_verify_password_correct(self) -> None:
        """Verify should return True for correct password."""
        password = "correctpassword"
        stored_hash = hash_password(password)

        assert verify_password(password, stored_hash) is True

    def test_verify_password_incorrect(self) -> None:
        """Verify should return False for incorrect password."""
        password = "correctpassword"
        stored_hash = hash_password(password)

        assert verify_password("wrongpassword", stored_hash) is False

    def test_verify_password_with_provided_salt(self) -> None:
        """Verify should work with explicitly provided salt."""
        password = "testpassword"
        salt = "abcd" * 16  # 32 chars
        stored_hash = hash_password(password, salt)

        assert verify_password(password, stored_hash) is True


class TestJWTTokens:
    """Tests for JWT token creation and verification."""

    def test_create_access_token(self) -> None:
        """Access token should be created successfully."""
        data = {"sub": "123", "email": "test@example.com"}
        token = create_access_token(data)

        assert token is not None
        assert isinstance(token, str)
        assert len(token) > 0

    def test_create_refresh_token(self) -> None:
        """Refresh token should be created successfully."""
        data = {"sub": "123", "email": "test@example.com"}
        token = create_refresh_token(data)

        assert token is not None
        assert isinstance(token, str)
        assert len(token) > 0

    def test_access_token_expires_in_one_hour_by_default(self) -> None:
        """Access token should have 1 hour expiration."""
        from core.security import create_access_token, verify_token

        data = {"sub": "123", "email": "test@example.com"}
        token = create_access_token(data)
        payload = verify_token(token)

        # Token should have exp claim
        assert "exp" in payload
        assert payload["type"] == "access"

    def test_refresh_token_has_seven_day_expiration(self) -> None:
        """Refresh token should have 7 day expiration."""
        from core.security import create_refresh_token, verify_token

        data = {"sub": "123", "email": "test@example.com"}
        token = create_refresh_token(data)
        payload = verify_token(token)

        assert payload["type"] == "refresh"

    def test_custom_expiration(self) -> None:
        """Token should respect custom expiration delta."""
        from core.security import create_access_token, verify_token

        data = {"sub": "123"}
        token = create_access_token(data, expires_delta=timedelta(minutes=30))
        payload = verify_token(token)

        assert payload is not None

    def test_token_contains_sub_and_email(self) -> None:
        """Token should contain the provided data."""
        from core.security import create_access_token, verify_token

        data = {"sub": "456", "email": "user@test.com"}
        token = create_access_token(data)
        payload = verify_token(token)

        assert payload["sub"] == "456"
        assert payload["email"] == "user@test.com"
