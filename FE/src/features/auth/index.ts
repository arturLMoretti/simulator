/**
 * Auth feature — public API.
 *
 * Other features should only import from this file, never reach into
 * the internal components/hooks/store directly.
 */
export { default as LoginPage } from './pages/LoginPage'
export { default as RegisterPage } from './pages/RegisterPage'
export { default as ProtectedRoute } from './components/ProtectedRoute'
export { ProtectedRouteWithRedirect, PublicRouteWithRedirect, default as AuthRedirect } from './components/AuthRedirect'
export { useAuthStore } from './store/authStore'
export type { User, AuthState } from './store/authStore'
export { useLogin } from './hooks/useLogin'
export { useRegister } from './hooks/useRegister'
export { useRefreshToken } from './hooks/useRefreshToken'
