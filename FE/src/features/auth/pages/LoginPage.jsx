/**
 * Login page — route-level component.
 * Composes the LoginForm inside the auth card layout.
 */
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from '@features/auth/components/LoginForm'
import { useAuthStore } from '@features/auth/store/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const { accessToken } = useAuthStore()
  const [showWelcome, setShowWelcome] = useState(false)
  const hasRedirected = useRef(false)

  console.log('LoginPage rendered, accessToken:', accessToken)
  useEffect(() => {
    if (accessToken && !hasRedirected.current) {
      hasRedirected.current = true
      // Intentionally setting state to show welcome message
      // eslint-disable-next-line
      setShowWelcome(true)
      const timer = setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [accessToken, navigate])

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 mb-4 shadow-lg">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        {showWelcome ? (
          <h1 className="text-2xl font-bold text-white">Welcome back!</h1>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-sm text-slate-300 mt-1">Sign in to your account</p>
          </>
        )}
      </div>

      {!showWelcome && (
        <LoginForm
          onSuccess={() => navigate('/dashboard', { replace: true })}
          onSwitchToRegister={() => navigate('/register')}
        />
      )}
    </>
  )
}
