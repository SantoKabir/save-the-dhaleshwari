import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Droplets } from "lucide-react";

export default function EventNotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Droplets className="h-8 w-8 text-primary" />
                    </div>
                </div>
                <h2 className="text-2xl font-semibold mb-2">Event not found</h2>
                <p className="text-muted-foreground mb-8">
                    This event either does not exist or has not been published
                    yet.
                </p>
                <Button asChild>
                    <Link href="/events">Back to Events</Link>
                </Button>
            </div>
        </div>
    );
}
