import Image from "next/image";

export function Partners() {
    return (
        <section className="py-12 bg-muted/50 border-y border-border">
            <div className="container mx-auto px-4">
                <p className="text-center text-sm text-muted-foreground mb-8">
                    In collaboration with
                </p>
                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
                    {/* National Geographic Society */}
                    <div className="text-center group">
                        <span className="text-lg md:text-xl font-bold tracking-wide text-muted-foreground group-hover:text-foreground transition-colors">
                            National Geographic Society
                        </span>
                    </div>
                    {/* Extern */}
                    <div className="grayscale hover:grayscale-0 transition-all duration-300">
                        <Image
                            src="/logos/extern.svg"
                            alt="Extern"
                            width={120}
                            height={50}
                            className="h-12 w-auto object-contain"
                        />
                    </div>
                    {/* The Nature Conservancy */}
                    <div className="text-center group">
                        <span className="text-lg md:text-xl font-bold tracking-wide text-muted-foreground group-hover:text-foreground transition-colors">
                            The Nature Conservancy
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
