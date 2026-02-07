"""Database migration system for asyncpg.

Usage:
    # Run all pending migrations
    python -m migrations run
    
    # Create a new migration file
    python -m migrations.create add_user_table
    
    # Rollback all migrations
    python -m migrations run --direction down
    
    # Rollback to specific migration
    python -m migrations run --direction down --target 20240101_initial
"""

from migrations.runner import migrate
from migrations.create import create_migration

__all__ = ["migrate", "create_migration"]
