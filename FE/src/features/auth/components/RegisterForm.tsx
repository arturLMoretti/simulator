/**
 * Register form component — handles account creation.
 * Uses React Hook Form + Zod for validation with shadcn/ui components.
 */
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRegister } from '@features/auth/hooks/useRegister'
import { useToastStore } from '@store/toastStore'
import { Button } from '@components/shadcn/button'
import { Input } from '@components/shadcn/input'
import { Label } from '@components/shadcn/label'
import { Card, CardContent } from '@components/shadcn/card'
import { cn } from '@lib/utils'

interface RegisterFormProps {
  onSuccess?: (data?: unknown) => void
  onSwitchToLogin?: () => void
}

const registerSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })
  
  const registerMutation = useRegister()
  const { success, error } = useToastStore()

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: (res) => {
          success('Account created successfully!')
          onSuccess?.(res.data)
        },
        onError: (err: Error) => {
          error(err.message || 'Registration failed')
        },
      },
    )
  }

  return (
    <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-sm">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="register-email">Email</Label>
            <Input
              id="register-email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={registerMutation.isPending}
              {...register('email')}
              className={cn(errors.email && 'border-red-500')}
            />
            {errors.email && (
              <p className="text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-password">Password</Label>
            <Input
              id="register-password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={registerMutation.isPending}
              {...register('password')}
              className={cn(errors.password && 'border-red-500')}
            />
            {errors.password && (
              <p className="text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-confirm-password">Confirm Password</Label>
            <Input
              id="register-confirm-password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={registerMutation.isPending}
              {...register('confirmPassword')}
              className={cn(errors.confirmPassword && 'border-red-500')}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Error */}
          {registerMutation.isError && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {registerMutation.error?.message || 'Registration failed'}
            </div>
          )}

          {/* Success */}
          {registerMutation.isSuccess && (
            <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Account created. You can log in now.
            </div>
          )}

          <Button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full"
          >
            {registerMutation.isPending ? (
              <span className="inline-flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Please wait…
              </span>
            ) : (
              'Create account'
            )}
          </Button>

          {/* Toggle */}
          <div className="mt-4 text-center text-sm text-slate-400">
            {'Already have an account? '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-purple-400 hover:text-purple-300 font-medium transition cursor-pointer"
            >
              Sign in
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
