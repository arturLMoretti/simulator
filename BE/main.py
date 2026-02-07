"""Application factory — creates and configures the FastAPI app.

This is the single entry-point.  All domain logic lives in ``modules/``.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from core.database import close_pool, create_pool
from core.middleware.error_handler import register_error_handlers
from modules.auth.router import router as auth_router


# ---------------------------------------------------------------------------
# Lifespan — replaces deprecated on_event("startup") / on_event("shutdown")
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(_app: FastAPI):
    # ── Startup ───────────────────────────────────────────────────────
    await create_pool()
    yield
    # ── Shutdown ──────────────────────────────────────────────────────
    await close_pool()


# ---------------------------------------------------------------------------
# App factory
# ---------------------------------------------------------------------------

def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name, lifespan=lifespan)

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Error handlers
    register_error_handlers(app)

    # Routers — add new domain routers here
    app.include_router(auth_router)

    # Health check (infrastructure, not a domain concern)
    @app.get("/api/health")
    async def health():
        return {"status": "ok"}

    return app


app = create_app()
