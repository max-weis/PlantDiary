import { useAuth } from '@/lib/auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAuth()

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold tracking-wide">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your dashboard, {user?.email}!</p>
      </div>
    </div>
  )
}
