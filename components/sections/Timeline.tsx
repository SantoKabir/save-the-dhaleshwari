"use client";

import { motion } from "framer-motion";
import { CheckCircle, Circle, AlertCircle, FlaskConical } from "lucide-react";

const timelineEvents = [
    {
        year: "2017",
        title: "Tannery Relocation — Problem Shifts",
        description:
            "Over 150 tanneries relocate from Hazaribagh to Savar. Chromium-laden effluent now discharges into the Dhaleshwari River, replacing one crisis with another.",
        status: "problem",
    },
    {
        year: "Jun 2025",
        title: "Research Initiative Launched",
        description:
            "Santo Kabir Ahmed founds the Dhaleshwari River Pollution Awareness project, supported by National Geographic Society, The Nature Conservancy, and Extern. Field research begins.",
        status: "progress",
    },
    {
        year: "Aug 2025",
        title: "Site Selection & Baseline Sampling",
        description:
            "Research team identifies six study villages. Water, soil, and biological samples collected at key discharge and control sites. Baseline chromium levels documented.",
        status: "progress",
    },
    {
        year: "Oct 2025",
        title: "Community Health Survey Design",
        description:
            "Survey instrument finalized with 25 structured questions covering health outcomes, water-use behaviour, and demographics. IRB-equivalent review completed.",
        status: "progress",
    },
    {
        year: "Jan 2026",
        title: "Community Survey — 150 Respondents",
        description:
            "Face-to-face household interviews conducted across Lonkarchar, Savar, and surrounding areas. Key finding: 53% of skin-rash cases strongly associated with river water use (Cramér's V = 0.72).",
        status: "current",
    },
    {
        year: "2026",
        title: "Policy Brief & Advocacy",
        description:
            "Comprehensive findings submitted to Bangladesh Department of Environment and partner NGOs. Community health recommendations presented to district authorities.",
        status: "upcoming",
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
                    <p className="text-primary text-sm uppercase tracking-widest font-medium mb-3">
                        Research Timeline
                    </p>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
                        Milestones &amp; Progress
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        From the tannery relocation crisis to our community
                        health survey findings.
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="max-w-3xl mx-auto">
                    {timelineEvents.map((event, index) => (
                        <motion.div
                            key={event.year + event.title}
                            className="flex gap-4 md:gap-8 pb-12 last:pb-0"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {/* Timeline Line */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                        event.status === "current"
                                            ? "bg-accent text-accent-foreground"
                                            : event.status === "progress"
                                              ? "bg-primary text-primary-foreground"
                                              : event.status === "problem"
                                                ? "bg-destructive/20 text-destructive"
                                                : "bg-muted text-muted-foreground"
                                    }`}
                                >
                                    {event.status === "current" ? (
                                        <FlaskConical className="h-5 w-5" />
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
                                <p className="text-muted-foreground">
                                    {event.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
