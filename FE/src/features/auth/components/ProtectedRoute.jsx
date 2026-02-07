/**
 * Route guard — redirects unauthenticated users to /login.
 */
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@features/auth/store/authStore'

export default function ProtectedRoute({ children }) {
  const token = useAuthStore((s) => s.accessToken)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
