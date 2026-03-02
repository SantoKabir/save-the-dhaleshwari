"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ImageGallery } from "@/components/mdx/ImageGallery";
import type { ReactNode } from "react";

// Type for event data passed from server
interface EventData {
    id: string;
    title: string;
    slug: string;
    summary: string | null;
    event_date: string;
    location: string | null;
    cover_image_url: string | null;
    is_highlighted: boolean;
    is_published: boolean;
    tags: string[];
    media: {
        id: string;
        media_url: string;
        media_type: string;
        caption: string | null;
        sort_order: number;
    }[];
    created_at: string;
    updated_at: string | null;
}

interface EventDetailClientProps {
    event: EventData;
    mdxContent: ReactNode;
    prevEvent: { slug: string; title: string } | null;
    nextEvent: { slug: string; title: string } | null;
    tags: string[];
}

export function EventDetailClient({
    event,
    mdxContent,
    prevEvent,
    nextEvent,
    tags,
}: EventDetailClientProps) {
    return (
        <>
            <Header />
            <main className="pt-16">
                {/* Hero */}
                <section className="relative h-72 md:h-96 bg-muted overflow-hidden">
                    {event.cover_image_url ? (
                        <Image
                            src={event.cover_image_url}
                            alt={event.title}
                            fill
                            className="object-cover"
                            sizes="100vw"
                            priority
                        />
                    ) : (
                        <div className="absolute inset-0 bg-primary/15 flex items-center justify-center">
                            <span className="text-primary/20 font-serif text-9xl font-bold">
                                D
                            </span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
                        {/* Breadcrumb */}
                        <nav className="text-sm text-muted-foreground mb-3">
                            <Link
                                href="/events"
                                className="hover:text-foreground transition-colors"
                            >
                                Events
                            </Link>
                            <span className="mx-2">›</span>
                            <span className="text-foreground">
                                {event.title}
                            </span>
                        </nav>
                    </div>
                </section>

                {/* Content */}
                <article className="container mx-auto px-4 max-w-4xl py-12">
                    {/* Header */}
                    <header className="mb-10">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                {new Date(event.event_date).toLocaleDateString(
                                    "en-US",
                                    {
                                        weekday: "long",
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    },
                                )}
                            </span>
                            {event.location && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4" />
                                    {event.location}
                                </span>
                            )}
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6">
                            {event.title}
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            {event.summary}
                        </p>
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-6">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </header>

                    {/* MDX Content - pre-compiled on server */}
                    <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-serif prose-a:text-primary prose-img:rounded-xl">
                        {mdxContent}
                    </div>

                    {/* Event Media Gallery */}
                    {event.media.length > 0 && (
                        <section className="mt-16 pt-10 border-t border-border">
                            <h2 className="font-serif text-2xl font-bold mb-6">
                                Event Gallery
                            </h2>
                            <ImageGallery
                                items={event.media.map((m) => ({
                                    media_url: m.media_url,
                                    caption: m.caption,
                                    media_type: m.media_type as
                                        | "IMAGE"
                                        | "VIDEO"
                                        | "CHART",
                                }))}
                            />
                        </section>
                    )}

                    {/* Prev / Next navigation */}
                    <nav className="mt-16 pt-10 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {prevEvent ? (
                            <Link
                                href={`/events/${prevEvent.slug}`}
                                className="group flex flex-col p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/30 transition-colors"
                            >
                                <span className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                                    <ChevronLeft className="h-3.5 w-3.5" />{" "}
                                    Previous
                                </span>
                                <span className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
                                    {prevEvent.title}
                                </span>
                            </Link>
                        ) : (
                            <div />
                        )}

                        {nextEvent && (
                            <Link
                                href={`/events/${nextEvent.slug}`}
                                className="group flex flex-col p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/30 transition-colors sm:text-right"
                            >
                                <span className="text-xs text-muted-foreground flex items-center gap-1 mb-2 sm:justify-end">
                                    Next{" "}
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </span>
                                <span className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
                                    {nextEvent.title}
                                </span>
                            </Link>
                        )}
                    </nav>
                </article>
            </main>
            <Footer />
        </>
    );
}
