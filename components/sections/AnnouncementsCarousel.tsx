"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Announcement {
    id: string;
    title: string;
    content: string;
    image_url: string | null;
    link_url: string | null;
}

interface AnnouncementsCarouselProps {
    announcements: Announcement[];
}

export function AnnouncementsCarousel({
    announcements,
}: AnnouncementsCarouselProps) {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);

    useEffect(() => {
        if (announcements.length <= 1) return;
        const id = setInterval(() => {
            setDirection(1);
            setCurrent((c) => (c + 1) % announcements.length);
        }, 6000);
        return () => clearInterval(id);
    }, [announcements.length]);

    if (announcements.length === 0) return null;

    const prev = () => {
        setDirection(-1);
        setCurrent(
            (c) => (c - 1 + announcements.length) % announcements.length,
        );
    };
    const next = () => {
        setDirection(1);
        setCurrent((c) => (c + 1) % announcements.length);
    };

    const variants = {
        enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
    };

    return (
        <section className="bg-gradient-to-b from-primary/10 via-primary/5 to-transparent text-foreground overflow-hidden border-b border-border/40">
            <div className="relative h-64 md:h-72">
                <AnimatePresence
                    initial={false}
                    custom={direction}
                    mode="popLayout"
                >
                    <motion.div
                        key={announcements[current].id}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.45, ease: "easeInOut" }}
                        className="absolute inset-0 flex items-center"
                    >
                        {announcements[current].image_url && (
                            <div className="absolute inset-0">
                                <Image
                                    src={announcements[current].image_url}
                                    alt={announcements[current].title}
                                    fill
                                    className="object-cover opacity-10"
                                    sizes="100vw"
                                />
                            </div>
                        )}
                        <div className="relative z-10 container mx-auto px-12 md:px-20 max-w-4xl text-center">
                            <p className="text-primary text-xs uppercase tracking-widest font-medium mb-3">
                                Announcement
                            </p>
                            <h2 className="font-serif text-2xl md:text-4xl font-bold mb-4">
                                {announcements[current].title}
                            </h2>
                            <p className="text-muted-foreground text-sm md:text-base leading-relaxed line-clamp-2">
                                {announcements[current].content}
                            </p>
                            {announcements[current].link_url && (
                                <Link
                                    href={announcements[current].link_url!}
                                    className="inline-block mt-4 text-primary text-sm font-medium hover:underline"
                                >
                                    Learn more →
                                </Link>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Nav buttons */}
                {announcements.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            aria-label="Previous"
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-muted hover:bg-muted/80 border border-border/50 flex items-center justify-center transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5 text-foreground/70" />
                        </button>
                        <button
                            onClick={next}
                            aria-label="Next"
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-muted hover:bg-muted/80 border border-border/50 flex items-center justify-center transition-colors"
                        >
                            <ChevronRight className="h-5 w-5 text-foreground/70" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                            {announcements.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setDirection(i > current ? 1 : -1);
                                        setCurrent(i);
                                    }}
                                    className={`w-1.5 h-1.5 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-muted-foreground/30"}`}
                                    aria-label={`Slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
