"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Phone, Crown, Quote } from "lucide-react";
import type { MemberStatus } from "@/lib/generated/prisma";

interface Leader {
    id: string;
    name: string;
    bio: string;
    email: string | null;
    phone: string | null;
    picture_url: string | null;
    status: MemberStatus;
    division: { id: string; name: string } | null;
}

interface TeamLeaderShowcaseProps {
    leader: Leader;
}

export function TeamLeaderShowcase({ leader }: TeamLeaderShowcaseProps) {
    // Split bio into first sentence (highlight) and the rest
    const firstPeriod = leader.bio.indexOf(". ");
    const highlight =
        firstPeriod > 0 ? leader.bio.slice(0, firstPeriod + 1) : "";
    const restBio =
        firstPeriod > 0 ? leader.bio.slice(firstPeriod + 2) : leader.bio;

    return (
        <section className="relative py-8 md:py-10 overflow-hidden">
            {/* Subtle background accent */}
            {/* <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/[0.03] to-transparent" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/[0.02] rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
            </div> */}

            <div className="relative z-10 container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Section label */}
                    <motion.div
                        className="flex items-center gap-3 mb-12"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <Crown className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-xs font-semibold text-primary uppercase tracking-[0.2em]">
                            Project Lead
                        </span>
                        <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
                    </motion.div>

                    {/* Leader card — cinematic split layout */}
                    <div className="grid md:grid-cols-5 gap-0 md:gap-0 items-stretch">
                        {/* Photo column (2/5) */}
                        <motion.div
                            className="md:col-span-2 relative"
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.7,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            <div className="relative aspect-[3/4] md:aspect-auto md:h-full rounded-2xl md:rounded-r-none overflow-hidden bg-muted">
                                {leader.picture_url ? (
                                    <Image
                                        src={leader.picture_url}
                                        alt={leader.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 40vw"
                                        priority
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center">
                                        <span className="text-primary text-8xl font-bold font-serif opacity-60">
                                            {leader.name.charAt(0)}
                                        </span>
                                    </div>
                                )}

                                {/* Gradient overlays */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                                <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-card/60" />

                                {/* Floating name on mobile */}
                                <div className="md:hidden absolute bottom-0 left-0 right-0 p-6">
                                    <h2 className="font-serif text-3xl font-bold text-white drop-shadow-lg">
                                        {leader.name}
                                    </h2>
                                </div>
                            </div>
                        </motion.div>

                        {/* Content column (3/5) */}
                        <motion.div
                            className="md:col-span-3 relative bg-card border border-border md:border-l-0 rounded-2xl md:rounded-l-none p-8 md:p-12 lg:p-16 flex flex-col justify-center"
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.7,
                                delay: 0.15,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            {/* Desktop name */}
                            <h2 className="hidden md:block font-serif text-4xl lg:text-5xl font-bold mb-2 leading-tight">
                                {leader.name}
                            </h2>
                            {leader.division && (
                                <span className="inline-flex items-center text-xs font-medium text-primary/80 bg-primary/5 border border-primary/10 px-2 py-0.5 rounded mb-6">
                                    {leader.division.name}
                                </span>
                            )}
                            {!leader.division && <div className="mb-4" />}

                            {/* Bio — full text, no truncation */}
                            <div className="space-y-4 mb-8">
                                {highlight && (
                                    <div className="relative pl-5 border-l-2 border-primary/40">
                                        <Quote className="absolute -left-2.5 -top-1 w-5 h-5 text-primary/30 bg-card" />
                                        <p className="text-base md:text-lg font-medium leading-relaxed text-foreground/90">
                                            {highlight}
                                        </p>
                                    </div>
                                )}
                                {restBio && (
                                    <p className="text-muted-foreground leading-relaxed text-[15px]">
                                        {restBio}
                                    </p>
                                )}
                            </div>

                            {/* Contact links */}
                            <div className="flex flex-wrap gap-3">
                                {leader.email && (
                                    <a
                                        href={`mailto:${leader.email}`}
                                        className="group inline-flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors bg-muted/50 hover:bg-primary/5 border border-border/50 hover:border-primary/30 px-4 py-2.5 rounded-xl"
                                    >
                                        <Mail className="h-4 w-4 text-primary/60 group-hover:text-primary transition-colors" />
                                        {leader.email}
                                    </a>
                                )}
                                {leader.phone && (
                                    <a
                                        href={`tel:${leader.phone}`}
                                        className="group inline-flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors bg-muted/50 hover:bg-primary/5 border border-border/50 hover:border-primary/30 px-4 py-2.5 rounded-xl"
                                    >
                                        <Phone className="h-4 w-4 text-primary/60 group-hover:text-primary transition-colors" />
                                        {leader.phone}
                                    </a>
                                )}
                            </div>

                            {/* Corner decorative element */}
                            <div className="absolute top-6 right-6 w-20 h-20 border border-primary/[0.06] rounded-full hidden lg:block" />
                            <div className="absolute top-10 right-10 w-12 h-12 border border-primary/[0.04] rounded-full hidden lg:block" />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
