/**
 * Login form component — handles email/password input and submission.
 * Delegates API call to the useLogin hook.
 */
import { useState } from 'react'
import { useLogin } from '@features/auth/hooks/useLogin'
import { useToastStore } from '@store/toastStore'

export default function LoginForm({ onSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const loginMutation = useLogin()
  const { success, error } = useToastStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim() || !password) return

    loginMutation.mutate(
      { email: email.trim(), password },
      {
        onSuccess: (res) => {
          success('Logged in successfully!')
          onSuccess?.(res.data)
        },
        onError: (err) => {
          error(err.message || 'Login failed')
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-slate-200 mb-1.5">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          disabled={loginMutation.isPending}
          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-slate-200 mb-1.5">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          disabled={loginMutation.isPending}
          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition disabled:opacity-50"
        />
      </div>

      {/* Error */}
      {loginMutation.isError && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {loginMutation.error?.message || 'Login failed'}
        </div>
      )}

      {/* Success */}
      {loginMutation.isSuccess && (
        <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Logged in successfully
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25 cursor-pointer"
      >
        {loginMutation.isPending ? (
          <span className="inline-flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Please wait…
          </span>
        ) : (
          'Sign in'
        )}
      </button>

      {/* Toggle */}
      <div className="mt-6 text-center text-sm text-slate-400">
        {"Don't have an account? "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-purple-400 hover:text-purple-300 font-medium transition cursor-pointer"
        >
          Register
        </button>
      </div>
    </form>
  )
}
