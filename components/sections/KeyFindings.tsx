"use client";

import Image from "next/image";
import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function AnimatedNumber({
    value,
    suffix = "",
}: {
    value: number;
    suffix?: string;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            animate(motionValue, value, { duration: 1.5, ease: "easeOut" });
        }
    }, [isInView, motionValue, value]);

    useEffect(() => {
        const unsubscribe = motionValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.round(latest) + suffix;
            }
        });
        return unsubscribe;
    }, [motionValue, suffix]);

    return <span ref={ref}>0{suffix}</span>;
}

export function KeyFindings() {
    return (
        <section className="py-20 md:py-28 bg-[oklch(0.23_0.025_205)] dark:bg-[oklch(0.20_0.018_230)] text-white overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Intro */}
                <motion.div
                    className="max-w-2xl mb-16 md:mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <p className="text-accent text-sm uppercase tracking-widest font-medium mb-4">
                        Survey Findings — January 2026
                    </p>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight">
                        We interviewed 56 families in two villages next to the
                        discharge zone. Here&apos;s what they told us.
                    </h2>
                </motion.div>

                {/* 3 key findings — staggered asymmetric layout */}
                <div className="grid md:grid-cols-12 gap-y-12 md:gap-8">
                    {/* Finding 1 — large */}
                    <motion.div
                        className="md:col-span-5"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-6xl md:text-7xl font-serif font-bold block mb-3">
                            <AnimatedNumber value={75} suffix="%" />
                        </span>
                        <p className="text-white/50 text-sm uppercase tracking-wide font-medium mb-3">
                            Water Discoloration
                        </p>
                        <p className="text-white/70 leading-relaxed">
                            Three out of four respondents report the river has
                            turned black or reddish. 63% describe foul chemical
                            odour. Half say fish populations have collapsed.
                        </p>
                    </motion.div>

                    {/* Finding 2 — medium, offset to the right */}
                    <motion.div
                        className="md:col-span-4 md:col-start-7 md:pt-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <span className="text-6xl md:text-7xl font-serif font-bold block mb-3">
                            <AnimatedNumber value={68} suffix="%" />
                        </span>
                        <p className="text-white/50 text-sm uppercase tracking-wide font-medium mb-3">
                            Skin Problems
                        </p>
                        <p className="text-white/70 leading-relaxed">
                            Skin rashes and severe itching are the dominant
                            complaint — reported by 38 out of 56 households.
                            Farmers and housewives are hit hardest due to daily
                            water contact.
                        </p>
                    </motion.div>

                    {/* Finding 3 — with image */}
                    <motion.div
                        className="md:col-span-5"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="text-6xl md:text-7xl font-serif font-bold block mb-3">
                            <AnimatedNumber value={46} suffix="%" />
                        </span>
                        <p className="text-white/50 text-sm uppercase tracking-wide font-medium mb-3">
                            Winter Is Worst
                        </p>
                        <p className="text-white/70 leading-relaxed">
                            Nearly half identify the dry season as the worst
                            period — low water flow concentrates toxins. But the
                            rainy season brings its own alarm: chemical foam and
                            red discoloration from industrial flushing.
                        </p>
                    </motion.div>

                    {/* Photo element */}
                    <motion.div
                        className="md:col-span-5 md:col-start-8 md:-mt-4"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <div className="aspect-[3/2] relative rounded-lg overflow-hidden">
                            <Image
                                src="/images/Water_Polluted_with_chemicals.jpg"
                                alt="Water polluted with industrial chemicals"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 40vw"
                            />
                        </div>
                        <p className="text-xs text-white/30 mt-3">
                            Chemically contaminated water near Hemayetpur
                        </p>
                    </motion.div>
                </div>

                {/* Bottom: community demand + CTA */}
                <motion.div
                    className="mt-16 md:mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="max-w-lg">
                        <p className="text-white/50 text-sm uppercase tracking-wide font-medium mb-2">
                            #1 Community Demand
                        </p>
                        <p className="text-xl md:text-2xl font-serif font-semibold text-white/90">
                            Remove the tanneries and provide deep submersible
                            pumps for clean groundwater access.
                        </p>
                    </div>
                    <Link
                        href="/events"
                        className="group inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors shrink-0"
                    >
                        Full research details
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </motion.div>

                <p className="text-xs text-white/20 mt-12">
                    Source: DRPA Community Health Survey, 56 respondents, Jan
                    31, 2026. Longkarchar &amp; Jihbakata, Keraniganj.
                </p>
            </div>
        </section>
    );
}
