"""Auth domain entities — plain dataclasses, no I/O."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class User:
    """Core user entity returned by the repository layer."""

    id: int
    email: str
    password_hash: str
    created_at: datetime
