export const dynamic = "force-dynamic";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Partners } from "@/components/sections/Partners";
import { Mission } from "@/components/sections/Mission";
import { KeyFindings } from "@/components/sections/KeyFindings";
import { Timeline } from "@/components/sections/Timeline";
import { HighlightedEvents } from "@/components/sections/HighlightedEvents";
import { prisma } from "@/lib/prisma";

export default async function Home() {
    const now = new Date();

    const highlightedEvents = await prisma.event
        .findMany({
            where: { is_highlighted: true, is_published: true },
            orderBy: { event_date: "desc" },
            take: 5,
            select: {
                id: true,
                title: true,
                slug: true,
                summary: true,
                cover_image_url: true,
                event_date: true,
            },
        })
        .catch(() => []);

    return (
        <>
            <Header />
            <main>
                <Hero />
                <Partners />
                <Mission />
                <KeyFindings />
                <Timeline />
                <HighlightedEvents events={highlightedEvents} />
            </main>
            <Footer />
        </>
    );
}
