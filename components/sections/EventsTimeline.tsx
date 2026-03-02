"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight, Droplets } from "lucide-react";

// ─────────────────────────────────────────────────────────
//  Layout constants — shared between SVG coordinate space
//  and CSS absolute positioning (1 SVG unit = 1 CSS pixel)
// ─────────────────────────────────────────────────────────
const SEG = 480; // vertical height per event segment (px & SVG units)
const TOP_PAD = 60; // space before first node
const BOT_PAD = 120; // space after last node
const VB_W = 1000; // SVG viewBox width
const NODE_L = 290; // SVG x for even events  (left-bank nodes)
const NODE_R = 710; // SVG x for odd events   (right-bank nodes)

function nodeX(i: number) {
    return i % 2 === 0 ? NODE_L : NODE_R;
}
function nodeY(i: number) {
    return TOP_PAD + i * SEG + SEG / 2;
}

/** Builds a smooth S-curve SVG path through all event nodes */
function buildRiverPath(count: number): string {
    if (count === 0) return "";

    let d = `M 500 0`;
    let px = 500,
        py = 0;

    for (let i = 0; i < count; i++) {
        const nx = nodeX(i);
        const ny = nodeY(i);
        const midY = (py + ny) / 2;
        // Classic cubic bezier S-bend:
        // CP1 stays at prevX so the curve exits vertically,
        // CP2 leads into nodeX so it arrives vertically.
        d += ` C ${px} ${midY}, ${nx} ${midY}, ${nx} ${ny}`;
        px = nx;
        py = ny;
    }

    // Tail: gracefully curve back to centre after last node
    const endY = TOP_PAD + count * SEG + BOT_PAD;
    d += ` C ${px} ${py + 120}, 500 ${endY - 80}, 500 ${endY}`;
    return d;
}

// ─────────────────────────────────────────────────────────

interface EventItem {
    id: string;
    title: string;
    slug: string;
    summary: string;
    cover_image_url: string | null;
    event_date: Date;
    location: string | null;
    tags: unknown;
}

interface EventsTimelineProps {
    events: EventItem[];
}

export function EventsTimeline({ events }: EventsTimelineProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 0.9", "end 0.1"],
    });
    const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

    if (events.length === 0) {
        return (
            <div className="py-32 text-center text-muted-foreground">
                <p className="text-lg">
                    No events published yet. Check back soon.
                </p>
            </div>
        );
    }

    const totalH = TOP_PAD + events.length * SEG + BOT_PAD;
    const riverPath = buildRiverPath(events.length);

    return (
        <>
            {/* ── Mobile: vertical flowing timeline ── */}
            <div className="md:hidden py-12">
                <MobileTimeline events={events} />
            </div>

            {/* ── Desktop: SVG river with floating cards ── */}
            <div
                ref={containerRef}
                className="hidden md:block relative w-full overflow-visible"
                style={{ height: totalH }}
            >
                {/* ── SVG river layer (purely decorative) ── */}
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox={`0 0 ${VB_W} ${totalH}`}
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        <linearGradient
                            id="riverGrad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="0%"
                                stopColor="oklch(0.55 0.14 195)"
                                stopOpacity="0.2"
                            />
                            <stop
                                offset="40%"
                                stopColor="oklch(0.55 0.14 195)"
                                stopOpacity="0.9"
                            />
                            <stop
                                offset="100%"
                                stopColor="oklch(0.55 0.14 195)"
                                stopOpacity="0.15"
                            />
                        </linearGradient>
                        <filter
                            id="riverGlow"
                            x="-50%"
                            y="-50%"
                            width="200%"
                            height="200%"
                        >
                            <feGaussianBlur stdDeviation="3.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <filter
                            id="nodeGlow"
                            x="-100%"
                            y="-100%"
                            width="300%"
                            height="300%"
                        >
                            <feGaussianBlur stdDeviation="5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Ghost track */}
                    <path
                        d={riverPath}
                        fill="none"
                        stroke="oklch(0.55 0.14 195)"
                        strokeWidth="2"
                        strokeOpacity="0.1"
                    />

                    {/* Animated river — scroll-driven */}
                    <motion.path
                        d={riverPath}
                        fill="none"
                        stroke="url(#riverGrad)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        filter="url(#riverGlow)"
                        style={{ pathLength }}
                    />

                    {/* Flowing shimmer dots — always animate */}
                    <motion.path
                        d={riverPath}
                        fill="none"
                        stroke="oklch(0.75 0.18 195)"
                        strokeWidth="1.5"
                        strokeOpacity="0.45"
                        strokeLinecap="round"
                        strokeDasharray="8 52"
                        animate={{ strokeDashoffset: [-60, 0] }}
                        transition={{
                            duration: 2.8,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        style={{ pathLength }}
                    />

                    {/* Per-event nodes & connectors */}
                    {events.map((_, i) => {
                        const nx = nodeX(i);
                        const ny = nodeY(i);
                        // Connector toward the card edge
                        const connX2 = i % 2 === 0 ? nx + 60 : nx - 60;

                        return (
                            <g key={i}>
                                {/* Horizontal connector to card */}
                                <motion.line
                                    x1={nx + (i % 2 === 0 ? 14 : -14)}
                                    y1={ny}
                                    x2={connX2}
                                    y2={ny}
                                    stroke="oklch(0.55 0.14 195)"
                                    strokeWidth="1.5"
                                    strokeOpacity="0.45"
                                    strokeDasharray="4 4"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                />

                                {/* Outer pulse ring 1 */}
                                <motion.circle
                                    cx={nx}
                                    cy={ny}
                                    r={16}
                                    fill="none"
                                    stroke="oklch(0.55 0.14 195)"
                                    strokeWidth="1"
                                    initial={{ scale: 1, opacity: 0.7 }}
                                    animate={{ scale: 2.6, opacity: 0 }}
                                    transition={{
                                        duration: 2.8,
                                        repeat: Infinity,
                                        repeatDelay: 0.4,
                                        delay: i * 0.35,
                                    }}
                                />
                                {/* Outer pulse ring 2 (staggered) */}
                                <motion.circle
                                    cx={nx}
                                    cy={ny}
                                    r={16}
                                    fill="none"
                                    stroke="oklch(0.55 0.14 195)"
                                    strokeWidth="0.8"
                                    initial={{ scale: 1, opacity: 0.4 }}
                                    animate={{ scale: 3.2, opacity: 0 }}
                                    transition={{
                                        duration: 2.8,
                                        repeat: Infinity,
                                        repeatDelay: 0.4,
                                        delay: i * 0.35 + 0.9,
                                    }}
                                />

                                {/* Node body */}
                                <motion.circle
                                    cx={nx}
                                    cy={ny}
                                    r={13}
                                    fill="oklch(0.13 0.02 240)"
                                    stroke="oklch(0.55 0.14 195)"
                                    strokeWidth="2.5"
                                    filter="url(#nodeGlow)"
                                    initial={{ scale: 0, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 200,
                                        damping: 15,
                                        delay: 0.15 + i * 0.06,
                                    }}
                                />
                                {/* Node inner dot */}
                                <motion.circle
                                    cx={nx}
                                    cy={ny}
                                    r={4.5}
                                    fill="oklch(0.75 0.18 195)"
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        delay: 0.35 + i * 0.06,
                                    }}
                                />

                                {/* Index label */}
                                <text
                                    x={nx}
                                    y={ny - 24}
                                    textAnchor="middle"
                                    fill="oklch(0.55 0.14 195)"
                                    fontSize="9"
                                    fontFamily="ui-monospace, monospace"
                                    opacity="0.55"
                                    letterSpacing="1"
                                >
                                    {String(i + 1).padStart(2, "0")}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* ── Floating event cards ── */}
                {events.map((event, i) => {
                    const ny = nodeY(i);
                    const isLeft = i % 2 === 0; // even = node on left, card on right

                    return (
                        <motion.div
                            key={event.id}
                            className="absolute z-10"
                            style={{
                                top: ny,
                                ...(isLeft
                                    ? { left: "33%", right: "2%" }
                                    : { left: "2%", right: "33%" }),
                                transform: "translateY(-50%)",
                            }}
                            initial={{ opacity: 0, x: isLeft ? 50 : -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{
                                duration: 0.65,
                                delay: 0.1,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            <DesktopEventCard
                                event={event}
                                index={i}
                                isLeft={isLeft}
                            />
                        </motion.div>
                    );
                })}
            </div>
        </>
    );
}

// ─────────────────────────────────────────────────────────
//  Desktop card — editorial / magazine style
// ─────────────────────────────────────────────────────────
function DesktopEventCard({
    event,
    index,
    isLeft,
}: {
    event: EventItem;
    index: number;
    isLeft: boolean;
}) {
    const tags = Array.isArray(event.tags) ? (event.tags as string[]) : [];

    return (
        <Link href={`/events/${event.slug}`} className="group block">
            <motion.div
                className="relative bg-card/90 backdrop-blur-md border border-border/50 rounded-2xl overflow-hidden shadow-lg"
                whileHover={{
                    y: -5,
                    boxShadow:
                        "0 32px 72px -12px oklch(0.45 0.12 195 / 0.22), 0 0 0 1px oklch(0.55 0.14 195 / 0.25)",
                }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
            >
                {/* Top accent line */}
                <div className="h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

                <div className="flex">
                    {/* Cover image — left panel */}
                    <div className="relative w-40 shrink-0 bg-muted overflow-hidden">
                        {event.cover_image_url ? (
                            <Image
                                src={event.cover_image_url}
                                alt={event.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                sizes="160px"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/15 via-primary/8 to-transparent">
                                <Droplets className="h-8 w-8 text-primary/25" />
                            </div>
                        )}
                        {/* Edge fade toward content */}
                        <div
                            className={`absolute inset-0 ${
                                isLeft
                                    ? "bg-gradient-to-r from-transparent to-card/30"
                                    : "bg-gradient-to-l from-transparent to-card/30"
                            }`}
                        />
                        {/* Index badge */}
                        <div className="absolute top-3 left-3 font-mono text-[10px] font-semibold text-white/70 bg-black/40 backdrop-blur-sm px-1.5 py-0.5 rounded">
                            {String(index + 1).padStart(2, "0")}
                        </div>
                    </div>

                    {/* Content panel */}
                    <div className="flex-1 p-5 min-w-0">
                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-primary/70" />
                                {new Date(event.event_date).toLocaleDateString(
                                    "en-US",
                                    {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    },
                                )}
                            </span>
                            {event.location && (
                                <>
                                    <span className="text-border">·</span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3 text-primary/70" />
                                        {event.location}
                                    </span>
                                </>
                            )}
                        </div>

                        <h3 className="font-serif text-[17px] font-bold leading-snug mb-2 group-hover:text-primary transition-colors duration-200">
                            {event.title}
                        </h3>
                        <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                            {event.summary}
                        </p>

                        <div className="flex items-end justify-between gap-3">
                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {tags.slice(0, 2).map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-[10px] font-medium bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <motion.span
                                className="inline-flex items-center gap-1 text-[11px] text-primary font-semibold uppercase tracking-widest shrink-0 ml-auto"
                                whileHover={{ x: 2 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 20,
                                }}
                            >
                                Explore
                                <ArrowRight className="h-3 w-3" />
                            </motion.span>
                        </div>
                    </div>
                </div>

                {/* Animated bottom reveal bar on hover */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.35 }}
                />
            </motion.div>
        </Link>
    );
}

// ─────────────────────────────────────────────────────────
//  Mobile: vertical flowing timeline
// ─────────────────────────────────────────────────────────
function MobileTimeline({ events }: { events: EventItem[] }) {
    return (
        <div className="container mx-auto px-4">
            <div className="relative pl-10">
                {/* Vertical river track */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
                {/* Flowing shimmer on mobile track */}
                <motion.div
                    className="absolute left-4 top-0 w-px bg-gradient-to-b from-transparent via-primary to-transparent"
                    style={{ height: "30%" }}
                    animate={{ top: ["-30%", "130%"] }}
                    transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />

                <div className="space-y-10">
                    {events.map((event, i) => (
                        <motion.div
                            key={event.id}
                            className="relative"
                            initial={{ opacity: 0, x: -24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{
                                duration: 0.5,
                                delay: i * 0.07,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            {/* River node */}
                            <div className="absolute -left-6 top-5 flex items-center justify-center">
                                <motion.div
                                    className="absolute w-7 h-7 rounded-full border border-primary/30"
                                    animate={{
                                        scale: [1, 1.6, 1],
                                        opacity: [0.5, 0, 0.5],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        delay: i * 0.4,
                                    }}
                                />
                                <div className="w-3 h-3 rounded-full bg-primary border-2 border-background shadow-[0_0_8px_oklch(0.55_0.14_195/0.6)] z-10" />
                            </div>

                            {/* Mobile card */}
                            <Link
                                href={`/events/${event.slug}`}
                                className="group block"
                            >
                                <motion.div
                                    className="bg-card border border-border/60 rounded-xl overflow-hidden"
                                    whileHover={{ y: -2 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 350,
                                        damping: 25,
                                    }}
                                >
                                    {event.cover_image_url && (
                                        <div className="relative h-36 bg-muted">
                                            <Image
                                                src={event.cover_image_url}
                                                alt={event.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                sizes="100vw"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-transparent" />
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground mb-2">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3 text-primary/60" />
                                                {new Date(
                                                    event.event_date,
                                                ).toLocaleDateString("en-US", {
                                                    month: "long",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </span>
                                            {event.location && (
                                                <>
                                                    <span className="text-border">
                                                        ·
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3 text-primary/60" />
                                                        {event.location}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        <h3 className="font-serif text-base font-bold leading-snug mb-1.5 group-hover:text-primary transition-colors">
                                            {event.title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                                            {event.summary}
                                        </p>
                                        <span className="inline-flex items-center gap-1 text-xs text-primary font-semibold uppercase tracking-wider">
                                            Explore{" "}
                                            <ArrowRight className="h-3 w-3" />
                                        </span>
                                    </div>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
