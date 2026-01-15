"use client";

import { motion } from "framer-motion";
import { Camera, Megaphone, Scale } from "lucide-react";

const missions = [
    {
        title: "Document & Research",
        description:
            "Collect evidence, interview communities, and build a comprehensive case for change through rigorous documentation.",
        icon: Camera,
    },
    {
        title: "Educate & Advocate",
        description:
            "Raise awareness through schools, media, and community outreach. Empower locals to speak up for their rights.",
        icon: Megaphone,
    },
    {
        title: "Pressure for Change",
        description:
            "Push for enforcement of environmental laws, CETP upgrades, and accountability from tannery owners and authorities.",
        icon: Scale,
    },
];

export function Mission() {
    return (
        <section id="mission" className="py-20 md:py-32">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    className="text-center max-w-3xl mx-auto mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
                        Our Mission
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        We believe change is possible through documentation, education, and
                        persistent advocacy.
                    </p>
                </motion.div>

                {/* Mission Cards */}
                <div className="grid md:grid-cols-3 gap-8">
                    {missions.map((mission, index) => (
                        <motion.div
                            key={mission.title}
                            className="relative bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                        >
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                                <mission.icon className="h-7 w-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">{mission.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {mission.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
