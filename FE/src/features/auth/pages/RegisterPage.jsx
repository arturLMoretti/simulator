/**
 * Register page — route-level component.
 * Composes the RegisterForm inside the auth card layout.
 */
import { useNavigate } from 'react-router-dom'
import RegisterForm from '@features/auth/components/RegisterForm'

export default function RegisterPage() {
  const navigate = useNavigate()

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 mb-4 shadow-lg">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white">Create account</h1>
        <p className="text-sm text-slate-300 mt-1">Register a new account</p>
      </div>

      <RegisterForm
        onSuccess={() => {
          // After registration, redirect to login
          navigate('/login')
        }}
        onSwitchToLogin={() => navigate('/login')}
      />
    </>
  )
}
