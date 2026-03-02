import { Droplets } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Droplets className="h-5 w-5 text-primary/60" />
                    </div>
                </div>
                <p className="text-sm text-muted-foreground animate-pulse">
                    Loading…
                </p>
            </div>
        </div>
    );
}
