/**
 * Auth redirect handler — shows redirecting message for 2s before navigating.
 * Prevents flicker when checking authentication state.
 */
import { ReactNode } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@features/auth/store/authStore'

interface AuthRedirectProps {
  children: ReactNode
  redirectTo?: string
}

export default function AuthRedirect({ children, redirectTo = '/login' }: AuthRedirectProps) {
  const accessToken = useAuthStore((s) => s.accessToken)
  const location = useLocation()

  // If authenticated, render children
  if (accessToken) {
    return <>{children}</>
  }

  // Not authenticated - redirect
  return <Navigate to={redirectTo} state={{ from: location }} replace />
}

/**
 * Protected route wrapper with redirect message.
 * Shows "Redirecting you..." for 2s before redirecting to login.
 */
interface ProtectedRouteWithRedirectProps {
  children: ReactNode
}

export function ProtectedRouteWithRedirect({ children }: ProtectedRouteWithRedirectProps) {
  const navigate = useNavigate()
  const accessToken = useAuthStore((s) => s.accessToken)

  // If authenticated, show content immediately
  if (accessToken) {
    return <>{children}</>
  }

  // Show redirect message
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 mb-4">
          <svg className="w-8 h-8 text-purple-400 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Authentication Required</h2>
        <p className="text-slate-400 mb-4">You need to be logged in to access this page</p>
        <p className="text-sm text-purple-400">
          Redirecting you to login...
        </p>
        {setTimeout(() => {
          navigate('/login', { replace: true })
        }, 2000)}
      </div>
    </div>
  )
}

/**
 * Public route wrapper with redirect message for authenticated users.
 * Shows "Redirecting you to dashboard..." for 2s before redirecting.
 */
interface PublicRouteWithRedirectProps {
  children: ReactNode
}

export function PublicRouteWithRedirect({ children }: PublicRouteWithRedirectProps) {
  const navigate = useNavigate()
  const accessToken = useAuthStore((s) => s.accessToken)

  // If not authenticated, show content immediately
  if (!accessToken) {
    return <>{children}</>
  }

  // Show redirect message
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4">
          <svg className="w-8 h-8 text-emerald-400 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Welcome back!</h2>
        <p className="text-sm text-emerald-400">
          Redirecting you to dashboard...
        </p>
        {setTimeout(() => {
          navigate('/dashboard', { replace: true })
        }, 2000)}
      </div>
    </div>
  )
}
