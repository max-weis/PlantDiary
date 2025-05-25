import { Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void
  loading?: boolean
}

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export function LoginForm({ onSubmit, loading = false }: LoginFormProps) {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      const result = loginSchema.safeParse(value)
      if (result.success) {
        onSubmit(value.email, value.password)
      }
    },
  })

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
        <p className="text-sm text-gray-600">Login to your PlantDiary account</p>
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
          name="password"
          validators={{
            onChange: ({ value }) => {
              return value.length < 1 ? 'Password is required' : undefined
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
                autoComplete="current-password"
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
              data-testid="login-button"
              disabled={!canSubmit || loading || isSubmitting}
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || isSubmitting ? 'Signing in...' : 'Login'}
            </button>
          )}
        </form.Subscribe>

        <div className="text-center">
          <span className="text-sm text-gray-600">Don't have an account? </span>
          <Link to="/register" className="text-sm text-black hover:underline font-medium">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  )
} 