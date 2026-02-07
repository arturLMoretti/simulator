"""Entry point for running migrations via `python -m migrations`."""

import sys

if len(sys.argv) > 1 and sys.argv[1] == "create":
    # Handle `python -m migrations create <name>`
    from migrations.create import main as create_main
    create_main()
elif len(sys.argv) > 1 and sys.argv[1] == "run":
    # Handle `python -m migrations run` - strip "run" and pass remaining args
    sys.argv = [sys.argv[0]] + sys.argv[2:]
    from migrations.runner import main as run_main
    run_main()
else:
    # Handle `python -m migrations` (default - run migrations)
    from migrations.runner import main as run_main
    run_main()
