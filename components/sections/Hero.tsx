"use client";

import { Button } from "@/components/ui/button";
import { ArrowDown, ExternalLink } from "lucide-react";
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

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center text-white">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                        Save the <span className="text-accent">Dhaleshwari</span>
                    </h1>
                    <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-4 text-white/90">
                        Join the fight against pollution.
                    </p>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-white/70">
                        Be the voice for the river and the community.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            size="lg"
                            className="text-lg px-8 py-6 bg-accent hover:bg-accent/90 text-accent-foreground"
                            asChild
                        >
                            <a href="#volunteer">Become a Guardian</a>
                        </Button>
                        <Button
                            size="lg"
                            className="text-lg px-8 py-6 bg-white/90 hover:bg-white text-gray-900"
                            asChild
                        >
                            <a
                                href="https://storymaps.arcgis.com/stories/a0551ceb5b9f4b739674f4b6fa8e1d7e"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Learn More <ExternalLink className="ml-2 h-5 w-5" />
                            </a>
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
