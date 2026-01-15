import Image from "next/image";

const partners = [
    {
        name: "National Geographic Society",
        logo: "/logos/national_geographic_society.png",
        width: 150,
    },
    {
        name: "The Nature Conservancy",
        logo: "/logos/the_nature_conservancy.jpg",
        width: 150,
    },
    {
        name: "Extern",
        logo: "/logos/extern.svg",
        width: 120,
    },
];

export function Partners() {
    return (
        <section className="py-12 bg-muted/50 border-y border-border">
            <div className="container mx-auto px-4">
                <p className="text-center text-sm text-muted-foreground mb-8">
                    In collaboration with
                </p>
                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
                    {partners.map((partner) => (
                        <div
                            key={partner.name}
                            className="grayscale hover:grayscale-0 transition-all duration-300"
                        >
                            <Image
                                src={partner.logo}
                                alt={partner.name}
                                width={partner.width}
                                height={50}
                                className="h-12 w-auto object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
