"""In-process async event bus for cross-module communication.

Usage::

    from core.events import event_bus

    # Subscribe (typically at module import / startup)
    @event_bus.on("user.registered")
    async def handle_user_registered(payload: dict):
        ...

    # Publish (from a service)
    await event_bus.publish("user.registered", {"user_id": 42, "email": "a@b.com"})
"""

from __future__ import annotations

import asyncio
import logging
from typing import Any, Callable, Coroutine

logger = logging.getLogger(__name__)

EventHandler = Callable[..., Coroutine[Any, Any, None]]


class EventBus:
    """Simple in-process pub/sub.  Handlers run as fire-and-forget tasks."""

    def __init__(self) -> None:
        self._handlers: dict[str, list[EventHandler]] = {}

    # ── Subscribe ─────────────────────────────────────────────────────

    def subscribe(self, event_name: str, handler: EventHandler) -> None:
        self._handlers.setdefault(event_name, []).append(handler)

    def on(self, event_name: str):
        """Decorator form of :meth:`subscribe`."""
        def decorator(fn: EventHandler) -> EventHandler:
            self.subscribe(event_name, fn)
            return fn
        return decorator

    # ── Publish ───────────────────────────────────────────────────────

    async def publish(self, event_name: str, payload: dict | None = None) -> None:
        for handler in self._handlers.get(event_name, []):
            try:
                asyncio.create_task(handler(payload or {}))
            except Exception:
                logger.exception("Event handler %s failed for %s", handler, event_name)


# Singleton — import this everywhere
event_bus = EventBus()
