"use client";

import Image from "next/image";
import { Mail, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { MemberStatus } from "@/lib/generated/prisma";
import { useState } from "react";

interface Member {
    id: string;
    name: string;
    bio: string;
    email: string | null;
    picture_url: string | null;
    status: MemberStatus;
    division: { id: string; name: string } | null;
}

interface TeamGridProps {
    members: Member[];
}

export function TeamGrid({ members }: TeamGridProps) {
    // Group members by division (only divisions with members are shown)
    const grouped = members.reduce<
        {
            division: string | null;
            divisionId: string | null;
            members: Member[];
        }[]
    >((acc, member) => {
        const divName = member.division?.name ?? null;
        const divId = member.division?.id ?? null;
        const existing = acc.find((g) => g.divisionId === divId);
        if (existing) {
            existing.members.push(member);
        } else {
            acc.push({
                division: divName,
                divisionId: divId,
                members: [member],
            });
        }
        return acc;
    }, []);

    // Sort: named divisions first (alphabetically), then unassigned at end
    grouped.sort((a, b) => {
        if (a.division && b.division)
            return a.division.localeCompare(b.division);
        if (a.division) return -1;
        if (b.division) return 1;
        return 0;
    });

    let globalIndex = 0;

    return (
        <section className="py-16 pb-28">
            <div className="container mx-auto px-4">
                {/* Section header */}
                <motion.div
                    className="flex items-center gap-3 max-w-6xl mx-auto"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >   
                </motion.div>

                {/* Grouped by division */}
                <div className="max-w-6xl mx-auto space-y-12">
                    {grouped.map((group) => {
                        const startIndex = globalIndex;
                        globalIndex += group.members.length;
                        return (
                            <DivisionGroup
                                key={group.divisionId ?? "__none"}
                                divisionName={group.division}
                                members={group.members}
                                startIndex={startIndex}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// ─────────────────────────────────────────────────────────
//  Division group — heading + member grid
// ─────────────────────────────────────────────────────────
function DivisionGroup({
    divisionName,
    members,
    startIndex,
}: {
    divisionName: string | null;
    members: Member[];
    startIndex: number;
}) {
    return (
        <div>
            <motion.div
                className="flex items-center gap-3 mb-6"
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
            >
                <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-[0.15em]">
                    {divisionName ?? "Other Members"}
                </h3>
                <span className="text-[11px] font-mono text-muted-foreground/50">
                    ({members.length})
                </span>
                <div className="flex-1 h-px bg-border/40" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {members.map((member, i) => (
                    <MemberCard
                        key={member.id}
                        member={member}
                        index={startIndex + i}
                    />
                ))}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────
//  Individual member card — editorial magazine style
// ─────────────────────────────────────────────────────────
function MemberCard({ member, index }: { member: Member; index: number }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const initials = member.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    // Determine if bio is long enough to warrant expand/collapse
    const isLongBio = member.bio.length > 200;
    const displayBio = isLongBio && !isExpanded ? member.bio : member.bio;

    return (
        <motion.div
            className="group relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
                duration: 0.55,
                delay: index * 0.06,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            <motion.div
                className="relative bg-card border border-border/60 rounded-2xl overflow-hidden"
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
                {/* Top accent */}
                <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                <div className="flex">
                    {/* Avatar / Photo panel */}
                    <div className="relative w-28 sm:w-36 shrink-0 bg-muted overflow-hidden">
                        {member.picture_url ? (
                            <Image
                                src={member.picture_url}
                                alt={member.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                sizes="144px"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/8 to-accent/5 flex items-center justify-center">
                                <span className="font-serif text-3xl font-bold text-primary/40 select-none">
                                    {initials}
                                </span>
                            </div>
                        )}
                        {/* Subtle right-edge fade */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20" />
                        {/* Index badge */}
                        <div className="absolute top-3 left-3 font-mono text-[9px] font-semibold text-foreground/40 bg-background/60 backdrop-blur-sm px-1.5 py-0.5 rounded">
                            {String(index + 1).padStart(2, "0")}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 sm:p-6 min-w-0 flex flex-col">
                        {/* Header row */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <div>
                                <h3 className="font-serif text-lg font-bold leading-tight group-hover:text-primary transition-colors duration-200">
                                    {member.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1.5">
                                    {member.status === "FORMER" ? (
                                        <span className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground/70 italic font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                                            Former member
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 text-[10px] text-accent font-semibold uppercase tracking-wider">
                                            <span className="relative flex h-1.5 w-1.5">
                                                <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
                                            </span>
                                            Active
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Email link (icon only) */}
                            {member.email && (
                                <a
                                    href={`mailto:${member.email}`}
                                    className="shrink-0 w-8 h-8 rounded-lg bg-muted/50 hover:bg-primary/10 border border-border/50 hover:border-primary/30 flex items-center justify-center transition-all group/mail"
                                    title={`Email ${member.name}`}
                                >
                                    <Mail className="h-3.5 w-3.5 text-muted-foreground group-hover/mail:text-primary transition-colors" />
                                </a>
                            )}
                        </div>

                        {/* Bio — FULL text, no truncation */}
                        <div className="relative">
                            <p
                                className={`text-[13px] text-muted-foreground leading-relaxed ${
                                    isLongBio && !isExpanded
                                        ? "line-clamp-4"
                                        : ""
                                }`}
                            >
                                {displayBio}
                            </p>
                            {isLongBio && (
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary/80 uppercase tracking-wider transition-colors"
                                >
                                    {isExpanded ? "Show less" : "Read more"}
                                    <ArrowUpRight
                                        className={`w-3 h-3 transition-transform ${
                                            isExpanded ? "rotate-90" : ""
                                        }`}
                                    />
                                </button>
                            )}
                        </div>

                        {/* Email link (text, mobile) */}
                        {member.email && (
                            <a
                                href={`mailto:${member.email}`}
                                className="mt-3 sm:hidden inline-flex items-center gap-1.5 text-[11px] text-muted-foreground/70 hover:text-primary transition-colors"
                            >
                                <Mail className="h-3 w-3" />
                                {member.email}
                            </a>
                        )}
                    </div>
                </div>

                {/* Hover bottom reveal */}
                <motion.div
                    className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent origin-center"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                />
            </motion.div>
        </motion.div>
    );
}
