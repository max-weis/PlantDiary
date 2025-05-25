import { Navigation } from '@/components/navigation'
import { Toaster } from '@/components/ui/sonner'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Toaster position='bottom-right' />
      <TanStackRouterDevtools />
    </div>
  ),
})
