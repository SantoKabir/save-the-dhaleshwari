import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementsCarousel } from "@/components/sections/AnnouncementsCarousel";
import { EventsTimeline } from "@/components/sections/EventsTimeline";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "News & Events | Dhaleshwari River Pollution Awareness",
    description:
        "Announcements, research events, and field updates from the Dhaleshwari River Pollution Awareness initiative.",
};

export default async function EventsPage() {
    const now = new Date();

    const [announcements, events] = await Promise.all([
        prisma.announcement
            .findMany({
                where: {
                    is_active: true,
                    display_from: { lte: now },
                    OR: [
                        { display_until: null },
                        { display_until: { gte: now } },
                    ],
                },
                orderBy: { sort_order: "asc" },
                select: {
                    id: true,
                    title: true,
                    content: true,
                    image_url: true,
                    link_url: true,
                },
            })
            .catch(() => []),
        prisma.event
            .findMany({
                where: { is_published: true },
                orderBy: { event_date: "desc" },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    summary: true,
                    cover_image_url: true,
                    event_date: true,
                    location: true,
                    tags: true,
                },
            })
            .catch(() => []),
    ]);

    return (
        <>
            <Header />
            <main className="pt-16">
                {/* Announcements carousel */}
                {announcements.length > 0 && (
                    <AnnouncementsCarousel announcements={announcements} />
                )}

                {/* Page header */}
                <section className="py-20 bg-muted/30 border-b border-border">
                    <div className="container mx-auto px-4 text-center max-w-3xl">
                        <p className="text-primary text-sm uppercase tracking-widest font-medium mb-3">
                            Research Updates
                        </p>
                        <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
                            News &amp; Events
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Follow our research journey — field surveys,
                            community meetings, data analysis sessions, and
                            policy engagements.
                        </p>
                    </div>
                </section>

                {/* Events timeline */}
                <EventsTimeline events={events} />
            </main>
            <Footer />
        </>
    );
}
