/**
 * Centralised route definitions.
 *
 * - Auth routes use AuthLayout (centered card)
 * - App routes use AppLayout (header + content) behind ProtectedRoute
 */
import { createBrowserRouter, Navigate } from 'react-router-dom'
import AuthLayout from '@layouts/AuthLayout'
import AppLayout from '@layouts/AppLayout'
import ProtectedRoute from '@features/auth/components/ProtectedRoute'

import LoginPage from '@features/auth/pages/LoginPage'
import RegisterPage from '@features/auth/pages/RegisterPage'
import DashboardPage from '@features/dashboard/pages/DashboardPage'

export const router = createBrowserRouter([
  // ── Public (auth) routes ───────────────────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },

  // ── Protected (app) routes ─────────────────────────────────────────
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
    ],
  },

  // ── Fallback ───────────────────────────────────────────────────────
  { path: '*', element: <Navigate to="/login" replace /> },
])
