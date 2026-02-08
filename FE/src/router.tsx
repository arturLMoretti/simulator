/**
 * Centralised route definitions.
 *
 * - Auth routes use AuthLayout (centered card)
 * - App routes use AppLayout (header + content) behind ProtectedRouteWithRedirect
 */
import { createBrowserRouter, Navigate } from 'react-router-dom'
import AuthLayout from '@layouts/AuthLayout'
import AppLayout from '@layouts/AppLayout'
import { ProtectedRouteWithRedirect, PublicRouteWithRedirect } from '@features/auth/components/AuthRedirect'

import LoginPage from '@features/auth/pages/LoginPage'
import RegisterPage from '@features/auth/pages/RegisterPage'
import DashboardPage from '@features/dashboard/pages/DashboardPage'

export const router = createBrowserRouter([
  // ── Public (auth) routes with redirect for authenticated users
  {
    element: (
      <PublicRouteWithRedirect>
        <AuthLayout />
      </PublicRouteWithRedirect>
    ),
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },

  // ── Protected (app) routes with redirect for unauthenticated users
  {
    element: (
      <ProtectedRouteWithRedirect>
        <AppLayout />
      </ProtectedRouteWithRedirect>
    ),
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
    ],
  },

  // ── Fallback ───────────────────────────────────────────────────────
  { path: '*', element: <Navigate to="/login" replace /> },
])
