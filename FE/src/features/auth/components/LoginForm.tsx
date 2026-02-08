/**
 * Login form component — handles email/password input and submission.
 * Uses React Hook Form + Zod for validation with shadcn/ui components.
 */
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useLogin } from '@features/auth/hooks/useLogin'
import { useToastStore } from '@store/toastStore'
import { Button } from '@components/shadcn/button'
import { Input } from '@components/shadcn/input'
import { Label } from '@components/shadcn/label'
import { Card, CardContent } from '@components/shadcn/card'
import { cn } from '@lib/utils'

interface LoginFormProps {
  onSuccess?: (data?: unknown) => void
  onSwitchToRegister?: () => void
}

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })
  
  const loginMutation = useLogin()
  const { success, error } = useToastStore()

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: (res) => {
          success('Logged in successfully!')
          onSuccess?.(res.data)
        },
        onError: (err: Error) => {
          error(err.message || 'Login failed')
        },
      },
    )
  }

  return (
    <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-sm">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={loginMutation.isPending}
              {...register('email')}
              className={cn(errors.email && 'border-red-500')}
            />
            {errors.email && (
              <p className="text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={loginMutation.isPending}
              {...register('password')}
              className={cn(errors.password && 'border-red-500')}
            />
            {errors.password && (
              <p className="text-sm text-red-400">{errors.password.message}</p>
            )}
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

          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full"
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
          </Button>

          {/* Toggle */}
          <div className="mt-4 text-center text-sm text-slate-400">
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
      </CardContent>
    </Card>
  )
}
