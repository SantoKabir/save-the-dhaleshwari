"use client";

import { motion } from "framer-motion";
import { CheckCircle, Circle, AlertCircle } from "lucide-react";

const timelineEvents = [
    {
        year: "1960s",
        title: "Hazaribagh Tanneries Begin",
        description:
            "Unregulated tanneries established in Hazaribagh, Dhaka, begin polluting the Buriganga River.",
        status: "past",
    },
    {
        year: "2003",
        title: "BSCIC Estate Planned",
        description:
            "Government plans the BSCIC Tannery Industrial Estate in Savar with a promised Common Effluent Treatment Plant.",
        status: "past",
    },
    {
        year: "2017",
        title: "Relocation Complete",
        description:
            "Tanneries relocated to Savar. Problem shifted from Buriganga to Dhaleshwari River.",
        status: "problem",
    },
    {
        year: "2020",
        title: "DoE Takes Action",
        description:
            "Department of Environment fines 8 tanneries 21 lakh BDT for pollution violations.",
        status: "progress",
    },
    {
        year: "2022",
        title: "Major Enforcement",
        description:
            "DoE fines BSCIC 6 crore BDT and closes 7 tanneries for discharging untreated wastewater.",
        status: "progress",
    },
    {
        year: "2024",
        title: "Scientific Evidence",
        description:
            "Research confirms chromium levels 10x higher than WHO guidelines near CETP discharge.",
        status: "problem",
    },
    {
        year: "2025",
        title: "Save the Dhaleshwari Launches",
        description:
            "Environmental conservation program launches to fight pollution and empower communities.",
        status: "current",
    },
];

export function Timeline() {
    return (
        <section id="timeline" className="py-20 md:py-32 bg-muted/30">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    className="text-center max-w-3xl mx-auto mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
                        The Journey So Far
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        A timeline of events that led us here and the progress being made.
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="max-w-3xl mx-auto">
                    {timelineEvents.map((event, index) => (
                        <motion.div
                            key={event.year}
                            className="flex gap-4 md:gap-8 pb-12 last:pb-0"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {/* Timeline Line */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${event.status === "current"
                                            ? "bg-accent text-accent-foreground"
                                            : event.status === "progress"
                                                ? "bg-primary text-primary-foreground"
                                                : event.status === "problem"
                                                    ? "bg-destructive/20 text-destructive"
                                                    : "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    {event.status === "current" ? (
                                        <Circle className="h-5 w-5 fill-current" />
                                    ) : event.status === "progress" ? (
                                        <CheckCircle className="h-5 w-5" />
                                    ) : event.status === "problem" ? (
                                        <AlertCircle className="h-5 w-5" />
                                    ) : (
                                        <Circle className="h-5 w-5" />
                                    )}
                                </div>
                                {index < timelineEvents.length - 1 && (
                                    <div className="w-0.5 h-full bg-border mt-2" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="pb-4">
                                <span className="text-sm font-medium text-primary">
                                    {event.year}
                                </span>
                                <h3 className="text-lg font-semibold mt-1 mb-2">
                                    {event.title}
                                </h3>
                                <p className="text-muted-foreground">{event.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
