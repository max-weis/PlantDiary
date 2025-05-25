import { Sidenav } from '@/components/sidenav'
import { Outlet, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
    component: () => (
        <div className="flex min-h-screen flex-col">
            <div className="container mx-auto px-4 md:px-6 grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
                <aside className="hidden w-[200px] flex-col md:flex lg:w-[240px]">
                    <Sidenav />
                </aside>
                <main className="flex w-full flex-1 flex-col overflow-hidden py-6">
                    <div className="grid gap-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    ),
})
