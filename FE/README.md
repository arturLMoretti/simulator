# Frontend (React + Vite + Tailwind CSS)

Login/register UI — feature-sliced modular architecture.

## Architecture

See [`plans/FE-ARCHITECTURE.md`](../plans/FE-ARCHITECTURE.md) for the full design document.

```
FE/src/
├── main.jsx                         # React root, mounts providers
├── router.jsx                       # Centralised route definitions
├── app/                             # Application-level wiring
│   ├── providers.jsx                # Compose all context providers
│   └── queryClient.js               # TanStack Query client config
├── api/                             # API client layer
│   ├── client.js                    # Axios instance + interceptors
│   └── endpoints/
│       ├── auth.js                  # login, register endpoints
│       └── index.js                 # Re-export all endpoints
├── features/                        # One folder per domain/feature
│   ├── auth/
│   │   ├── index.js                 # Public API — re-exports
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── components/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── hooks/
│   │   │   ├── useLogin.js
│   │   │   └── useRegister.js
│   │   └── store/
│   │       └── authStore.js         # Zustand auth slice
│   └── dashboard/
│       ├── index.js
│       └── pages/
│           └── DashboardPage.jsx
└── shared/
    ├── components/
    │   └── ErrorBoundary.jsx
    └── layouts/
        ├── AuthLayout.jsx           # Centered card for login/register
        └── AppLayout.jsx            # Header + content for app pages
```

## Run locally

```bash
npm install
npm run dev
```

Runs at **http://localhost:5173**. Set `VITE_API_URL=http://localhost:18080` if the API is elsewhere.

## Key dependencies

| Package | Purpose |
|---------|---------|
| `react-router-dom` | Client-side routing |
| `@tanstack/react-query` | Server state management (API caching) |
| `zustand` | Client state management (auth tokens, UI) |
| `axios` | HTTP client with interceptors |
| `tailwindcss` | Utility-first CSS |

## State management

- **Server state** → TanStack Query (API data, caching, refetching)
- **Client state** → Zustand (auth tokens, UI preferences)

## Feature pattern

Each feature is self-contained with pages, components, hooks, and store.
Features communicate through shared state (Zustand) or the router.
