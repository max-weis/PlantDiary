import { Link } from '@tanstack/react-router';
import { Leaf } from 'lucide-react';
import { Button } from './ui/button';

export function Navigation() {
    return (
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 md:px-6 flex h-14 items-center">
                <Link to="/" className="flex items-center gap-2 font-semibold">
                    <Leaf className="h-5 w-5 text-emerald-600" />
                    <span>PlantDiary</span>
                </Link>
                <div className="ml-auto flex items-center gap-2">
                    <Link to="/login">
                        <Button variant="ghost" size="sm">
                            Login
                        </Button>
                    </Link>
                    <Link to="/register">
                        <Button size="sm">Register</Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
