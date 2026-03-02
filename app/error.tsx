"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                    </div>
                </div>
                <h2 className="text-2xl font-semibold mb-2">
                    Something went wrong
                </h2>
                <p className="text-muted-foreground mb-6">
                    An unexpected error occurred. Please try again.
                    {error.digest && (
                        <span className="block mt-1 text-xs font-mono opacity-60">
                            Error ID: {error.digest}
                        </span>
                    )}
                </p>
                <Button onClick={reset}>Try again</Button>
            </div>
        </div>
    );
}
