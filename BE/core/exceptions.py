"""Base domain exceptions.

All domain modules should subclass these for their specific errors.
The global error handler in ``core.middleware.error_handler`` catches
``DomainException`` and returns a consistent JSON envelope.
"""


class DomainException(Exception):
    """Base for all domain-level errors."""

    status_code: int = 400
    detail: str = "Domain error"

    def __init__(self, detail: str | None = None, status_code: int | None = None):
        if detail is not None:
            self.detail = detail
        if status_code is not None:
            self.status_code = status_code
        super().__init__(self.detail)


class NotFoundError(DomainException):
    status_code = 404
    detail = "Resource not found"


class ConflictError(DomainException):
    status_code = 409
    detail = "Resource already exists"


class UnauthorizedError(DomainException):
    status_code = 401
    detail = "Invalid credentials"


class ValidationError(DomainException):
    status_code = 422
    detail = "Validation error"
