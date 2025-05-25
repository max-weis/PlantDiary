import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { CalendarDays, Leaf, LineChart, ListTodo, User } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-emerald-50 to-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Keep Your Plants Thriving with PlantDiary
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Track care schedules, document growth, and never forget to water your plants again.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/register">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" data-testid="get-started">
                    Get Started
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="lg" variant="outline">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Key Features</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Everything you need to become a successful plant parent
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center gap-2 rounded-lg border p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <Leaf className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold">Plant Profiles</h3>
                <p className="text-center text-muted-foreground">
                  Create detailed profiles with botanical names, photos, and metadata for each of your plants.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg border p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <ListTodo className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold">Care Schedules</h3>
                <p className="text-center text-muted-foreground">
                  Set custom watering, fertilizing, and other care tasks with reminders so you never forget.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg border p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <CalendarDays className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold">History Logs</h3>
                <p className="text-center text-muted-foreground">
                  Keep a detailed history of all care activities to understand what works best for each plant.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg border p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <LineChart className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold">Growth Tracking</h3>
                <p className="text-center text-muted-foreground">
                  Visualize your plant's growth over time with measurements and progress photos.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg border p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <User className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold">User Accounts</h3>
                <p className="text-center text-muted-foreground">
                  Secure login and authentication to keep your plant data safe and accessible across devices.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg border p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-emerald-600"
                  >
                    <path d="M12 2v8"></path>
                    <path d="m4.93 10.93 1.41 1.41"></path>
                    <path d="M2 18h2"></path>
                    <path d="M20 18h2"></path>
                    <path d="m19.07 10.93-1.41 1.41"></path>
                    <path d="M22 22H2"></path>
                    <path d="M16 6a4 4 0 0 0-8 0"></path>
                    <path d="M16 18a4 4 0 0 0-8 0"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Notes & Observations</h3>
                <p className="text-center text-muted-foreground">
                  Add notes, tags, and photos to document observations and track plant health issues.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center justify-center gap-4 text-center md:flex-row md:gap-8 md:text-left">
          <div className="flex items-center gap-2 font-semibold">
            <Leaf className="h-5 w-5 text-emerald-600" />
            <span>PlantDiary</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} PlantDiary. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
