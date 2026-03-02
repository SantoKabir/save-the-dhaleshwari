"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FlaskConical, Users, MapPin, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const dataStrip = [
    { number: "56", label: "Households Surveyed" },
    { number: "75%", label: "Report Water Discoloration" },
    { number: "68%", label: "Report Skin Problems" },
    { number: "84%", label: "Have Seen Dead Fish" },
];

export function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url('/images/People_bathing_in_the_river_in_Lonkarchar_village.jpg')`,
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex items-center justify-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto"
                    >
                        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                            Dhaleshwari River{" "}
                            <span className="text-accent">Pollution</span>{" "}
                            Awareness
                        </h1>

                        <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 text-white/80 leading-relaxed">
                            Documenting the environmental and public health
                            crisis threatening communities along the Dhaleshwari
                            River in Bangladesh — turning field data into
                            advocacy.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto text-base px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                                asChild
                            >
                                <Link href="/events">
                                    <FlaskConical className="mr-2 h-5 w-5" />
                                    View Research
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full sm:w-auto text-base px-8 py-6 border-white/30 text-white bg-white/5 hover:bg-white/10"
                                asChild
                            >
                                <Link href="/team">
                                    <Users className="mr-2 h-5 w-5" />
                                    Meet the Team
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Data Strip */}
            <div className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-white text-center">
                        {dataStrip.map((d, i) => (
                            <motion.div
                                key={d.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 + i * 0.15 }}
                            >
                                <span className="text-xl sm:text-2xl md:text-3xl font-bold font-serif">
                                    {d.number}
                                </span>
                                <p className="text-[11px] sm:text-xs text-white/50 mt-1">
                                    {d.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
