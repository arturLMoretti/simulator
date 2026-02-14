/**
 * Auth feature — public API.
 *
 * Other features should only import from this file, never reach into
 * the internal components/hooks/store directly.
 */
export { default as LoginPage } from './pages/LoginPage'
export { default as RegisterPage } from './pages/RegisterPage'
export { default as ProtectedRoute } from './components/ProtectedRoute'
export { useAuthStore } from './store/authStore'
export { useLogin } from './hooks/useLogin'
export { useRegister } from './hooks/useRegister'
export type { AuthState, AuthUser } from './store/authStore'
