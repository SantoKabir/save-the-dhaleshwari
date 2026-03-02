"use client";

import {
    motion,
    useInView,
    useMotionValue,
    useTransform,
    animate,
} from "framer-motion";
import { useEffect, useRef } from "react";

interface StatItem {
    label: string;
    value: number;
    suffix: string;
    prefix?: string;
    description: string;
    color: string;
}

const stats: StatItem[] = [
    {
        label: "Skin-Rash Association",
        value: 53,
        suffix: "%",
        description:
            "of skin-rash cases strongly linked to river water use by local communities",
        color: "text-destructive",
    },
    {
        label: "Cramér's V Correlation",
        value: 0.72,
        suffix: "",
        description:
            "correlation between river water exposure and disease outcome (strong effect)",
        color: "text-primary",
    },
    {
        label: "Survey Respondents",
        value: 150,
        suffix: "+",
        description:
            "household interviews conducted across affected villages in January 2026",
        color: "text-accent",
    },
    {
        label: "Chromium Exceedance",
        value: 10,
        suffix: "×",
        description:
            "above WHO safe limits measured near CETP discharge points in water samples",
        color: "text-primary",
    },
];

function AnimatedNumber({
    value,
    suffix,
    prefix,
}: {
    value: number;
    suffix: string;
    prefix?: string;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const isInView = useInView(ref, { once: true });
    const decimals = value < 10 ? 2 : 0;

    useEffect(() => {
        if (isInView) {
            animate(motionValue, value, { duration: 1.5, ease: "easeOut" });
        }
    }, [isInView, motionValue, value]);

    // Subscribe to changes
    useEffect(() => {
        const unsubscribe = motionValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent =
                    (prefix ?? "") + latest.toFixed(decimals) + suffix;
            }
        });
        return unsubscribe;
    }, [motionValue, suffix, prefix, decimals]);

    return <span ref={ref}>{(prefix ?? "") + "0" + suffix}</span>;
}

export function KeyFindings() {
    return (
        <section className="py-20 md:py-28 bg-[oklch(0.23_0.025_205)] dark:bg-[oklch(0.20_0.018_230)] text-white">
            <div className="container mx-auto px-4">
                <motion.div
                    className="text-center max-w-3xl mx-auto mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <p className="text-accent text-sm uppercase tracking-widest font-medium mb-3">
                        January 2026 Community Survey
                    </p>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
                        Key Research Findings
                    </h2>
                    <p className="text-lg text-white/70 leading-relaxed">
                        Our baseline survey across six villages reveals a stark
                        picture of environmental injustice along the Dhaleshwari
                        River.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className="text-center"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                        >
                            <div
                                className={`text-5xl md:text-6xl font-bold font-serif mb-3 ${stat.color}`}
                            >
                                <AnimatedNumber
                                    value={stat.value}
                                    suffix={stat.suffix}
                                    prefix={stat.prefix}
                                />
                            </div>
                            <p className="text-sm font-semibold text-white/80 uppercase tracking-wide mb-2">
                                {stat.label}
                            </p>
                            <p className="text-xs text-white/50 leading-relaxed hidden md:block">
                                {stat.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
