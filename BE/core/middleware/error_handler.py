"""Global exception handlers — registered on the FastAPI app.

Maps ``DomainException`` subclasses and FastAPI validation errors to a
consistent JSON envelope: ``{"error": "..."}``
"""

from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from core.exceptions import DomainException


def register_error_handlers(app: FastAPI) -> None:
    """Attach exception handlers to *app*."""

    @app.exception_handler(DomainException)
    async def _domain_exc(_request, exc: DomainException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": exc.detail},
        )

    @app.exception_handler(HTTPException)
    async def _http_exc(_request, exc: HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": exc.detail},
        )

    @app.exception_handler(RequestValidationError)
    async def _validation_exc(_request, exc: RequestValidationError):
        return JSONResponse(
            status_code=422,
            content={"error": str(exc)},
        )
