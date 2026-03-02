"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventCard {
    id: string;
    title: string;
    slug: string;
    summary: string;
    cover_image_url: string | null;
    event_date: Date;
}

interface HighlightedEventsProps {
    events: EventCard[];
}

export function HighlightedEvents({ events }: HighlightedEventsProps) {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);

    useEffect(() => {
        if (events.length <= 1) return;
        const id = setInterval(() => {
            setDirection(1);
            setCurrent((c) => (c + 1) % events.length);
        }, 5000);
        return () => clearInterval(id);
    }, [events.length]);

    const prev = () => {
        setDirection(-1);
        setCurrent((c) => (c - 1 + events.length) % events.length);
    };

    const next = () => {
        setDirection(1);
        setCurrent((c) => (c + 1) % events.length);
    };

    if (events.length === 0) return null;

    const variants = {
        enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
    };

    return (
        <section className="py-20 md:py-28">
            <div className="container mx-auto px-4">
                <div className="flex items-end justify-between mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-primary text-sm uppercase tracking-widest font-medium mb-2">
                            Latest From the Field
                        </p>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold">
                            Research &amp; Events
                        </h2>
                    </motion.div>
                    <Button
                        variant="ghost"
                        asChild
                        className="hidden sm:flex gap-2"
                    >
                        <Link href="/events">
                            View All <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* Carousel */}
                <div className="relative overflow-hidden rounded-2xl bg-card border border-border">
                    <div className="relative h-[420px] md:h-[480px]">
                        <AnimatePresence
                            initial={false}
                            custom={direction}
                            mode="popLayout"
                        >
                            <motion.div
                                key={events[current].id}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    duration: 0.45,
                                    ease: "easeInOut",
                                }}
                                className="absolute inset-0 flex flex-col md:flex-row"
                            >
                                {/* Image */}
                                <div className="relative w-full md:w-1/2 h-52 md:h-full bg-muted shrink-0">
                                    {events[current].cover_image_url ? (
                                        <Image
                                            src={
                                                events[current].cover_image_url
                                            }
                                            alt={events[current].title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                            <span className="text-primary/40 font-serif text-6xl">
                                                D
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex flex-col justify-center p-8 md:p-12">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(
                                            events[current].event_date,
                                        ).toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </div>
                                    <h3 className="font-serif text-2xl md:text-3xl font-bold mb-4 leading-tight">
                                        {events[current].title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                                        {events[current].summary}
                                    </p>
                                    <Button asChild className="w-fit">
                                        <Link
                                            href={`/events/${events[current].slug}`}
                                        >
                                            Read More{" "}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation */}
                    {events.length > 1 && (
                        <>
                            <button
                                onClick={prev}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 border border-border flex items-center justify-center hover:bg-background transition-colors z-10"
                                aria-label="Previous event"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                onClick={next}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 border border-border flex items-center justify-center hover:bg-background transition-colors z-10"
                                aria-label="Next event"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>

                            {/* Dots */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                {events.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setDirection(i > current ? 1 : -1);
                                            setCurrent(i);
                                        }}
                                        className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-border"}`}
                                        aria-label={`Go to event ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="mt-6 sm:hidden text-center">
                    <Button variant="outline" asChild>
                        <Link href="/events">View All Events</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
