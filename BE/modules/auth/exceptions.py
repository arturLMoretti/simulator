"""Auth-specific domain exceptions."""

from core.exceptions import ConflictError, UnauthorizedError


class EmailAlreadyRegistered(ConflictError):
    detail = "Email already registered"


class InvalidCredentials(UnauthorizedError):
    detail = "Invalid email or password"
