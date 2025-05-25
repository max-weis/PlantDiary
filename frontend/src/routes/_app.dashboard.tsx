import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { createFileRoute, Link } from '@tanstack/react-router'
import {  Plus } from 'lucide-react'

export const Route = createFileRoute('/_app/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAuth()

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your dashboard, {user?.username}!</p>
        </div>
        <Link to="/plants/new" >
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4" />
            Add Plant
          </Button>
        </Link>
      </div>
    </div>
  )
}
