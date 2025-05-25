"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CalendarDays, Home, Leaf, LineChart, Settings } from "lucide-react"
import { Link, useLocation } from "@tanstack/react-router"

export function Sidenav() {
    const { pathname } = useLocation()
    
    return (
        <nav className="grid items-start gap-2 py-6">
            <Link to="/dashboard">
                <Button variant="ghost" className={cn("w-full justify-start", pathname === "/dashboard" && "bg-muted")}>
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                </Button>
            </Link>
            <Link to="/dashboard">
                <Button variant="ghost" className={cn("w-full justify-start", pathname?.startsWith("/plants") && "bg-muted")}>
                    <Leaf className="mr-2 h-4 w-4" />
                    My Plants
                </Button>
            </Link>
            <Link to="/dashboard">
                <Button variant="ghost" className={cn("w-full justify-start", pathname?.startsWith("/calendar") && "bg-muted")}>
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Care Calendar
                </Button>
            </Link>
            <Link to="/dashboard">
                <Button variant="ghost" className={cn("w-full justify-start", pathname?.startsWith("/progress") && "bg-muted")}>
                    <LineChart className="mr-2 h-4 w-4" />
                    Progress Tracking
                </Button>
            </Link>
            <Link to="/dashboard">
                <Button variant="ghost" className={cn("w-full justify-start", pathname?.startsWith("/settings") && "bg-muted")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                </Button>
            </Link>
        </nav>
    )
}
