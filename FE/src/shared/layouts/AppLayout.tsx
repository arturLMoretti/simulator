/**
 * App layout — used for authenticated pages.
 * Includes a header with logout; content area renders child routes.
 */
import { Outlet } from 'react-router-dom'
import { useAuthStore } from '../../features/auth/store/authStore'

export default function AppLayout() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-white">Simulator</h1>
          <div className="flex items-center gap-4">
            {user?.email && (
              <span className="text-sm text-slate-300">{user.email}</span>
            )}
            <button
              onClick={logout}
              className="text-sm text-slate-400 hover:text-white transition cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
