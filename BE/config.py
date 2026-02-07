"""Application settings — loaded from environment variables / .env file."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Type-safe configuration.  Every field can be overridden by an
    environment variable of the same name (case-insensitive)."""

    # ── Database ──────────────────────────────────────────────────────
    db_host: str = "localhost"
    db_port: int = 5432
    db_name: str = "login_db"
    db_user: str = "login_user"
    db_password: str = "login_pass"
    db_pool_min: int = 2
    db_pool_max: int = 10

    # ── CORS ──────────────────────────────────────────────────────────
    cors_origins: list[str] = ["*"]

    # ── Server ────────────────────────────────────────────────────────
    app_name: str = "Login API"
    debug: bool = False

    # ── JWT ──────────────────────────────────────────────────────────
    jwt_secret: str = "your-super-secret-jwt-key-change-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60  # 1 hour
    refresh_token_expire_days: int = 7

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


# Singleton — import this everywhere
settings = Settings()
