import { Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

interface RegisterFormProps {
  onSubmit: (email: string, username: string, password: string) => void
  loading?: boolean
}

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export function RegisterForm({ onSubmit, loading = false }: RegisterFormProps) {
  const form = useForm({
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value }) => {
      const result = registerSchema.safeParse(value)
      if (result.success) {
        onSubmit(value.email, value.username, value.password)
      }
    },
  })

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">Create your account</h1>
        <p className="text-sm text-gray-600">Join PlantDiary today</p>
      </div>
      
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              const result = z.string().email().safeParse(value)
              return result.success ? undefined : 'Please enter a valid email address'
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                data-testid="email-input"
                name={field.name}
                type="email"
                autoComplete="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="m@example.com"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              <div className="h-5">
                {field.state.meta.errors.length > 0 && (
                  <div className="text-red-500 text-sm">
                    {field.state.meta.errors[0]}
                  </div>
                )}
              </div>
            </div>
          )}
        </form.Field>

        <form.Field
          name="username"
          validators={{
            onChange: ({ value }) => {
              if (value.length < 3) return 'Username must be at least 3 characters'
              if (value.length > 50) return 'Username must be less than 50 characters'
              if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores'
              return undefined
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                data-testid="username-input"
                name={field.name}
                type="text"
                autoComplete="username"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="johndoe"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              <div className="h-5">
                {field.state.meta.errors.length > 0 && (
                  <div className="text-red-500 text-sm">
                    {field.state.meta.errors[0]}
                  </div>
                )}
              </div>
            </div>
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) => {
              return value.length < 6 ? 'Password must be at least 6 characters' : undefined
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                data-testid="password-input"
                name={field.name}
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder=""
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              <div className="h-5">
                {field.state.meta.errors.length > 0 && (
                  <div className="text-red-500 text-sm">
                    {field.state.meta.errors[0]}
                  </div>
                )}
              </div>
            </div>
          )}
        </form.Field>

        <form.Field
          name="confirmPassword"
          validators={{
            onChange: ({ value, fieldApi }) => {
              const password = fieldApi.form.getFieldValue('password')
              if (value.length < 1) return 'Please confirm your password'
              return value !== password ? "Passwords don't match" : undefined
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                data-testid="confirm-password-input"
                name={field.name}
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder=""
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              <div className="h-5">
                {field.state.meta.errors.length > 0 && (
                  <div className="text-red-500 text-sm">
                    {field.state.meta.errors[0]}
                  </div>
                )}
              </div>
            </div>
          )}
        </form.Field>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              data-testid="create-account-button"
              disabled={!canSubmit || loading || isSubmitting}
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          )}
        </form.Subscribe>

        <div className="text-center">
          <span className="text-sm text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-sm text-black hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  )
} 