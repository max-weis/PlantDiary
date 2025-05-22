import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { Leaf } from "lucide-react"

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
            <Leaf className="h-5 w-5 text-emerald-600" />
            <span>PlantDiary</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            {/* <UserNav /> */}
          </div>
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex lg:w-[240px]">
          {/* <DashboardNav /> */}
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden py-6">
          <div className="grid gap-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
