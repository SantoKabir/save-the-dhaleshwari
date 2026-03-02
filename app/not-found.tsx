import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Droplets } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Droplets className="h-8 w-8 text-primary" />
                    </div>
                </div>
                <p className="text-7xl font-bold text-primary/30 font-serif mb-2">
                    404
                </p>
                <h2 className="text-2xl font-semibold mb-2">Page not found</h2>
                <p className="text-muted-foreground mb-8">
                    The page you are looking for does not exist or has been
                    moved.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild>
                        <Link href="/">Go home</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/events">View events</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
