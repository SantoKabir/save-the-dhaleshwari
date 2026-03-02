"use client";

import { motion } from "framer-motion";
import { Microscope, HeartPulse, Landmark } from "lucide-react";

const pillars = [
    {
        title: "Field Research",
        description:
            "Systematic water sampling, soil testing, and community health surveys across villages along the Dhaleshwari River. We translate raw data into peer-quality evidence.",
        icon: Microscope,
    },
    {
        title: "Community Health Assessment",
        description:
            "Documenting the link between industrial effluent exposure and disease prevalence — skin conditions, respiratory illness, and heavy-metal toxicity — through structured interviews and surveys.",
        icon: HeartPulse,
    },
    {
        title: "Policy Advocacy",
        description:
            "Engaging regulators, industry bodies, and international partners to enforce CETP compliance and establish transparent emission-monitoring frameworks.",
        icon: Landmark,
    },
];

export function Mission() {
    return (
        <section id="about" className="py-20 md:py-32">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    className="text-center max-w-3xl mx-auto mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <p className="text-primary text-sm uppercase tracking-widest font-medium mb-3">
                        About the Initiative
                    </p>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
                        Science-Driven Environmental Action
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        The Dhaleshwari River Pollution Awareness project is a
                        student-led initiative working at the intersection of
                        environmental science, public health research, and
                        community advocacy — supported by the National
                        Geographic Society, The Nature Conservancy, and Extern.
                    </p>
                </motion.div>

                {/* Pillar Cards */}
                <div className="grid md:grid-cols-3 gap-8">
                    {pillars.map((pillar, index) => (
                        <motion.div
                            key={pillar.title}
                            className="relative bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                        >
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                                <pillar.icon className="h-7 w-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">
                                {pillar.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {pillar.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
