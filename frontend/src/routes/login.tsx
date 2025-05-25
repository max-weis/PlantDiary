import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../lib/auth'
import { useEffect } from 'react'
import { LoginForm } from '../components/login-form'
import { Loading } from '../components/loading'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const { login, loading, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: '/dashboard' })
    }
  }, [loading, user, navigate])

  if (loading) return <Loading message="Signing in..." />

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full bg-white rounded-sm shadow-sm overflow-hidden">
        <div className="flex">
          {/* Left side - Login Form */}
          <div className="w-1/2 p-8 lg:p-16 flex items-center justify-center">
            <LoginForm onSubmit={login} loading={loading} />
          </div>
          
          {/* Right side - Image */}
          <div className="hidden lg:block w-1/2 relative">
            <img 
              src="/login-hero.jpg" 
              alt="Login illustration" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
