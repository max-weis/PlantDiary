import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { Leaf } from "lucide-react"

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  )
}
