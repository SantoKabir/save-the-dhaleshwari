"use client";

import { motion } from "framer-motion";
import { Droplets } from "lucide-react";

interface TeamHeroProps {
    memberCount: number;
}

export function TeamHero({ memberCount }: TeamHeroProps) {
    return (
        <section className="relative py-14 md:py-20 overflow-hidden">
            {/* Animated background pattern — flowing water ripples */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.04] via-transparent to-primary/[0.02]" />
                {/* Subtle concentric rings */}
                {[...Array(4)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full border border-primary/[0.06]"
                        style={{
                            width: 300 + i * 180,
                            height: 300 + i * 180,
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                        }}
                        animate={{
                            scale: [1, 1.05, 1],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 4 + i * 0.8,
                            repeat: Infinity,
                            delay: i * 0.6,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl">
                {/* Floating icon */}
                <motion.div
                    className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 mb-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Droplets className="w-5 h-5 text-primary" />
                </motion.div>

                <motion.p
                    className="text-primary text-xs uppercase tracking-[0.25em] font-semibold mb-3"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    The People Behind the Endeavor
                </motion.p>

                <motion.h1
                    className="font-serif text-4xl md:text-5xl font-bold mb-4 leading-[1.1]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.7 }}
                >
                    Our{" "}
                    <span className="relative">
                        <span className="relative z-10">Team</span>
                        <motion.span
                            className="absolute bottom-1 left-0 right-0 h-3 bg-primary/15 -z-0 rounded-sm"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            style={{ originX: 0 }}
                        />
                    </span>
                </motion.h1>

                <motion.p
                    className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-5"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                >
                    A cross-disciplinary group of students and researchers
                    committed to scientific rigour, community engagement, and
                    environmental justice.
                </motion.p>

                {/* Member count badge */}
                {/* {memberCount > 0 && (
                    <motion.div
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/60 border border-border/50 px-4 py-2 rounded-full"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Users className="w-3.5 h-3.5 text-primary" />
                        <span>{memberCount} members strong</span>
                    </motion.div>
                )} */}
            </div>

            {/* Bottom border fade */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </section>
    );
}
