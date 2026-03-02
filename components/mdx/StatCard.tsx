"use client";

import { motion } from "framer-motion";
import { useInView, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef } from "react";

interface StatItem {
    value: number;
    suffix?: string;
    label: string;
    description?: string;
}

/** Single animated counter */
function AnimatedStat({ value, suffix = "", label, description }: StatItem) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const isInView = useInView(ref as React.RefObject<Element>, { once: true });
    const decimals = value < 10 && value % 1 !== 0 ? 2 : 0;

    useEffect(() => {
        if (isInView) {
            animate(motionValue, value, { duration: 1.5, ease: "easeOut" });
        }
    }, [isInView, motionValue, value]);

    useEffect(() => {
        return motionValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = latest.toFixed(decimals) + suffix;
            }
        });
    }, [motionValue, suffix, decimals]);

    return (
        <div className="p-4 text-center">
            <div className="text-4xl md:text-5xl font-bold font-serif text-primary mb-2">
                <span ref={ref}>0{suffix}</span>
            </div>
            <p className="font-semibold text-lg mb-1">{label}</p>
            {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}
        </div>
    );
}

/** Animated statistic highlight card — accepts a single stat or an array */
export function StatCard(props: StatItem & { stats?: StatItem[] }) {
    const { stats, ...single } = props;
    const items: StatItem[] = stats ?? (single.label ? [single] : []);

    if (items.length === 0) return null;

    return (
        <motion.div
            className="my-8 p-6 bg-primary/5 border border-primary/20 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <div
                className={`grid gap-4 ${
                    items.length === 1
                        ? "grid-cols-1"
                        : items.length === 2
                          ? "grid-cols-1 sm:grid-cols-2"
                          : items.length === 3
                            ? "grid-cols-1 sm:grid-cols-3"
                            : "grid-cols-2 md:grid-cols-4"
                }`}
            >
                {items.map((item, i) => (
                    <AnimatedStat key={i} {...item} />
                ))}
            </div>
        </motion.div>
    );
}

/** Simple data table */
export function DataTable({
    headers,
    rows,
}: {
    headers: string[];
    rows: (string | number)[][];
}) {
    return (
        <div className="my-6 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
                <thead className="bg-muted">
                    <tr>
                        {headers.map((h) => (
                            <th
                                key={h}
                                className="px-4 py-3 text-left font-semibold text-foreground"
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr
                            key={i}
                            className="border-t border-border even:bg-muted/30"
                        >
                            {row.map((cell, j) => (
                                <td
                                    key={j}
                                    className="px-4 py-3 text-muted-foreground"
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
