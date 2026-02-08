# Login App

Full-stack login with **Vite + React** (frontend), **Python FastAPI + Uvicorn** (backend), and **PostgreSQL** (database).

## Project Structure

- **FE/** – Vite + React frontend (login/register UI)
- **BE/** – Python FastAPI backend (REST API on port 18080)
- **DB/** – PostgreSQL schema and setup scripts
- **plans/** – Architecture documents

---

## Development Mode (Hot Reloading)

Changes to source files reflect immediately in containers.

```bash
docker compose -f docker-compose.dev.yml up
```

- **Frontend:** http://localhost:5173 (Vite dev server with HMR)
- **Backend:** http://localhost:18080 (uvicorn --reload with watchfiles)
- **PostgreSQL:** localhost:5432 (user `login_user`, db `login_db`, password `login_pass`)

---

## Production Mode (Docker Build)

Builds optimized containers and serves via nginx.

```bash
docker compose up --build
```

- **Frontend:** http://localhost:3000 (nginx serving built React app)
- **Backend API:** http://localhost:18080
- **PostgreSQL:** localhost:5432

---

## Default User

Default credentials: `admin@example.com` / `admin123`

---

## Architecture Documents

- [`plans/BE-ARCHITECTURE.md`](plans/BE-ARCHITECTURE.md) — Backend architecture: DDD modules, DI, event bus, 4-layer pattern
- [`plans/FE-ARCHITECTURE.md`](plans/FE-ARCHITECTURE.md) — Frontend architecture: feature-sliced, two-tier state, routing

---