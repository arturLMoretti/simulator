# Backend (Python FastAPI + Uvicorn)

REST API for the login app — modular, domain-driven architecture.

## Architecture

See [`plans/BE-ARCHITECTURE.md`](../plans/BE-ARCHITECTURE.md) for the full design document.

```
BE/
├── main.py                    # App factory, lifespan, mount routers
├── config.py                  # Settings via pydantic-settings
├── core/                      # Shared infrastructure
│   ├── database.py            # asyncpg pool lifecycle
│   ├── events.py              # In-process event bus
│   ├── security.py            # Password hashing helpers
│   ├── exceptions.py          # Base domain exceptions
│   └── middleware/
│       └── error_handler.py   # Global exception → JSON mapping
├── modules/                   # One sub-package per bounded context
│   └── auth/                  # Authentication domain
│       ├── router.py          # FastAPI APIRouter — HTTP layer
│       ├── schemas.py         # Pydantic request/response models
│       ├── service.py         # Business logic / use cases
│       ├── repository.py      # Data access — SQL queries
│       ├── models.py          # Domain entities (dataclasses)
│       ├── events.py          # Domain event constants
│       └── exceptions.py      # Auth-specific exceptions
└── requirements.txt
```

## Endpoints

| Method | Path             | Body (JSON)                | Description    |
|--------|------------------|----------------------------|----------------|
| POST   | `/api/register`  | `{ "email", "password" }`  | Create account |
| POST   | `/api/login`     | `{ "email", "password" }`  | Sign in        |
| GET    | `/api/health`    | –                          | Health check   |

## Run locally

```bash
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 18080 --reload
```

### Environment variables

| Variable      | Default       | Description              |
|---------------|---------------|--------------------------|
| `DB_HOST`     | `localhost`   | PostgreSQL host          |
| `DB_PORT`     | `5432`        | PostgreSQL port          |
| `DB_NAME`     | `login_db`    | Database name            |
| `DB_USER`     | `login_user`  | Database user            |
| `DB_PASSWORD` | `login_pass`  | Database password        |

## Layer pattern

Each domain module follows: **Router → Service → Repository → Models**

- **Router** — HTTP concerns only (parse, validate, respond)
- **Service** — Business logic, emits domain events
- **Repository** — Raw SQL via asyncpg, returns domain models
- **Models** — Plain dataclasses, no I/O

## Password hashing

Format: `salt$sha256hex(salt + password)` — compatible with the DB seed script.
