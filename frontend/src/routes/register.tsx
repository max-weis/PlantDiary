import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '../lib/auth'
import { toast } from 'sonner'
import { RegisterForm } from '../components/register-form'
import { Loading } from '../components/loading'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const { signup, loading, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      toast("Account created successfully.")
      navigate({ to: '/login' })
    }
  }, [loading, user, navigate])

  if (loading) return <Loading message="Creating account..." />

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full bg-white rounded-sm shadow-sm overflow-hidden">
        <div className="flex">
          {/* Left side - Register Form */}
          <div className="w-1/2 p-8 lg:p-16 flex items-center justify-center">
            <RegisterForm onSubmit={signup} loading={loading} />
          </div>
          
          {/* Right side - Image */}
          <div className="hidden lg:block w-1/2 relative">
            <img 
              src="/login-hero.jpg" 
              alt="Register illustration" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 