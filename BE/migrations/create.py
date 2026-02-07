"""Migration template generator.

Usage:
    python -m migrations create <migration_name>
"""

from datetime import datetime
from pathlib import Path

MIGRATIONS_DIR = Path(__file__).parent


def create_migration(name: str) -> str:
    """Create a new migration file with the given name."""
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    filename = f"{timestamp}_{name}.py"
    filepath = MIGRATIONS_DIR / filename

    template = f'''"""Migration: {name}

Created: {datetime.utcnow().isoformat()}
"""

from typing import Any
import asyncpg


async def up(conn: asyncpg.Connection) -> None:
    """Apply the migration."""
    # Add your SQL here
    pass


async def down(conn: asyncpg.Connection) -> None:
    """Rollback the migration."""
    # Add your rollback SQL here
    pass
'''

    filepath.write_text(template)
    return filename


def main() -> None:
    import sys

    # Skip the first arg (module name) when called from __main__.py
    args = sys.argv[1:] if sys.argv[0].endswith("__main__.py") else sys.argv

    if len(args) < 2 or args[0] != "create":
        print("Usage: python -m migrations create <migration_name>")
        sys.exit(1)

    name = args[1].lower().replace(" ", "_")
    filename = create_migration(name)
    print(f"Created migration: {filename}")


if __name__ == "__main__":
    main()
