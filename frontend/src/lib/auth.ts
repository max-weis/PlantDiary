import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { getAuth } from '../api/generated/auth/auth'
import type { LoginRequest, SignupRequest } from '../api/generated/model'

export function useAuth() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { login, signup } = getAuth()

  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => fetch('http://localhost:8000/api/me', { 
      credentials: 'include'  // This ensures cookies are sent
    }).then(res => {
      if (!res.ok) {
        throw new Error('Not authenticated')
      }
      return res.json()
    }),
    retry: false,
  })

  const loginMutation = useMutation({
    mutationFn: (request: LoginRequest) => login(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
      navigate({ to: '/' })
    },
  })

  const signupMutation = useMutation({
    mutationFn: (request: SignupRequest) => signup(request),
    onSuccess: () => {
      // After signup, automatically log in
      if (signupMutation.variables) {
        loginMutation.mutate(signupMutation.variables)
      }
    },
  })

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isSigningUp: signupMutation.isPending,
    loginError: loginMutation.error,
    signupError: signupMutation.error,
  }
}
