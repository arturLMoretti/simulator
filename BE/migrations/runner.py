"""Migration runner for asyncpg databases.

This module provides a simple migration system that:
- Tracks applied migrations in a _migrations table
- Runs pending migrations in order
- Supports both UP and DOWN migrations
"""

import asyncio
import importlib
from datetime import datetime
from pathlib import Path
from typing import Any

import asyncpg

# Find migrations directory
MIGRATIONS_DIR = Path(__file__).parent
MIGRATIONS_TABLE = "_migrations"


async def get_connection(dsn: str) -> asyncpg.Connection:
    """Create a database connection."""
    return await asyncpg.connect(dsn)


async def ensure_migrations_table(conn: asyncpg.Connection) -> None:
    """Create the migrations tracking table if it doesn't exist."""
    await conn.execute(f"""
        CREATE TABLE IF NOT EXISTS {MIGRATIONS_TABLE} (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            applied_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
    """)


async def get_applied_migrations(conn: asyncpg.Connection) -> set[str]:
    """Get the set of already applied migration names."""
    rows = await conn.fetch(f"SELECT name FROM {MIGRATIONS_TABLE}")
    return {row["name"] for row in rows}


async def run_migration(
    conn: asyncpg.Connection,
    migration: dict[str, Any],
    direction: str = "up"
) -> None:
    """Run a single migration."""
    func = migration["down"] if direction == "down" else migration["up"]
    await func(conn)
    print(f"  {direction.upper()}: {migration['name']}")


async def migrate(
    dsn: str,
    direction: str = "up",
    target: str | None = None
) -> None:
    """Run database migrations.

    Args:
        dsn: Database connection string
        direction: "up" to apply migrations, "down" to rollback
        target: Specific migration to target (default: all)
    """
    conn = await get_connection(dsn)
    try:
        await ensure_migrations_table(conn)
        applied = await get_applied_migrations(conn)

        # Load all migrations
        migrations = []
        for file in sorted(MIGRATIONS_DIR.glob("*.py")):
            if file.name.startswith("_") or file.name.startswith("."):
                continue
            if file.name == "__init__.py":
                continue

            module_name = file.stem
            spec = importlib.util.spec_from_file_location(module_name, file)
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)

            migrations.append({
                "name": module.__name__,
                "up": getattr(module, "up", None),
                "down": getattr(module, "down", None),
            })

        # Sort migrations alphabetically (files are already sorted)
        migrations.sort(key=lambda m: m["name"])

        if direction == "up":
            # Apply pending migrations
            pending = [m for m in migrations if m["name"] not in applied]
            for migration in pending:
                if target and migration["name"] != target:
                    continue
                if migration["up"]:
                    await run_migration(conn, migration, "up")
                    await conn.execute(
                        f"INSERT INTO {MIGRATIONS_TABLE} (name) VALUES ($1)",
                        migration["name"]
                    )
        else:
            # Rollback migrations
            if target:
                # Find and rollback target migration
                target_migration = next(
                    (m for m in reversed(migrations) if m["name"] == target),
                    None
                )
                if target_migration and target_migration["name"] in applied:
                    if target_migration["down"]:
                        await run_migration(conn, target_migration, "down")
                        await conn.execute(
                            f"DELETE FROM {MIGRATIONS_TABLE} WHERE name = $1",
                            target_migration["name"]
                        )
            else:
                # Rollback all
                applied_list = sorted([m for m in migrations if m["name"] in applied])
                for migration in reversed(applied_list):
                    if migration["down"]:
                        await run_migration(conn, migration, "down")
                        await conn.execute(
                            f"DELETE FROM {MIGRATIONS_TABLE} WHERE name = $1",
                            migration["name"]
                        )

    finally:
        await conn.close()


def main() -> None:
    """CLI entry point."""
    import argparse
    from config import settings

    parser = argparse.ArgumentParser(description="Database migration runner")
    parser.add_argument(
        "--direction", "-d",
        choices=["up", "down"],
        default="up",
        help="Migration direction (default: up)"
    )
    parser.add_argument(
        "--target", "-t",
        help="Target migration name"
    )
    args = parser.parse_args()

    dsn = f"postgresql://{settings.db_user}:{settings.db_password}@{settings.db_host}:{settings.db_port}/{settings.db_name}"

    print(f"Running migrations {args.direction}...")
    asyncio.run(migrate(dsn, args.direction, args.target))
    print("Done!")


if __name__ == "__main__":
    main()
