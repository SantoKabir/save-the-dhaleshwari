"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { AlertTriangle, Droplets, Users, Factory } from "lucide-react";

const stats = [
    {
        value: "10x",
        label: "Chromium levels above WHO limits",
        icon: AlertTriangle,
        color: "text-destructive",
    },
    {
        value: "~15km",
        label: "Pollution spread downstream",
        icon: Droplets,
        color: "text-primary",
    },
    {
        value: "100s",
        label: "Families lost fishing livelihoods",
        icon: Users,
        color: "text-warning",
    },
    {
        value: "30,000m³",
        label: "Daily wastewater exceeds capacity",
        icon: Factory,
        color: "text-muted-foreground",
    },
];

const pollutionImages = [
    {
        src: "/images/Open_ditch__drain_polluted_with_chemicals.jpg",
        alt: "Chemical-laden wastewater in drainage ditch",
    },
    {
        src: "/images/Sludge_lagoon.jpg",
        alt: "Tannery sludge lagoon",
    },
    {
        src: "/images/Waste_water_dump_into_the_Dhaleshwari.jpg",
        alt: "Wastewater being discharged into the river",
    },
    {
        src: "/images/Water_Polluted_with_chemicals.jpg",
        alt: "Polluted river water",
    },
];

export function Crisis() {
    return (
        <section id="crisis" className="py-20 md:py-32">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    className="text-center max-w-3xl mx-auto mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
                        The Crisis
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        The BSCIC Tannery Industrial Estate in Savar was meant to save the
                        Buriganga River. Instead, it shifted the pollution to the
                        Dhaleshwari, devastating communities downstream.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className="bg-card border border-border rounded-xl p-6 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <stat.icon className={`h-8 w-8 mx-auto mb-4 ${stat.color}`} />
                            <div className={`text-3xl md:text-4xl font-bold mb-2 ${stat.color}`}>
                                {stat.value}
                            </div>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {pollutionImages.map((image, index) => (
                        <motion.div
                            key={image.alt}
                            className="relative aspect-square rounded-xl overflow-hidden group"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                                <p className="p-4 text-white text-sm">{image.alt}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
