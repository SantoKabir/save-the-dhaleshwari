"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowDown, Users, FlaskConical } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url('/images/People_bathing_in_the_river_in_Lonkarchar_village.jpg')`,
                }}
            />

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center text-white">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-accent text-sm uppercase tracking-widest font-medium mb-4"
                    >
                        Student-Led Research &amp; Public Health Campaign
                    </motion.p>

                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                        Dhaleshwari River{" "}
                        <span className="text-accent">Pollution</span> Awareness
                    </h1>

                    <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-white/80 leading-relaxed">
                        Documenting the environmental and public health crisis
                        threatening communities along the Dhaleshwari River in
                        Bangladesh — turning field data into advocacy.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            size="lg"
                            className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                            asChild
                        >
                            <Link href="/events">
                                <FlaskConical className="mr-2 h-5 w-5" />
                                Explore Our Research
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="text-lg px-8 py-6 border-white/50 text-white bg-white/10 hover:bg-white/20"
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

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <ArrowDown className="h-6 w-6" />
            </motion.div>
        </section>
    );
}
