"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function Mission() {
    return (
        <section id="about" className="py-20 md:py-32">
            <div className="container mx-auto px-4">
                {/* Two-column editorial layout */}
                <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                    {/* Photo side */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="aspect-[4/5] relative rounded-lg overflow-hidden">
                            <Image
                                src="/images/Waste_water_dump_into_the_Dhaleshwari.jpg"
                                alt="Wastewater discharge into the Dhaleshwari River"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                            Untreated effluent being discharged into the
                            Dhaleshwari near Hemayetpur, Savar.
                        </p>
                    </motion.div>

                    {/* Text side */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <p className="text-primary text-sm uppercase tracking-widest font-medium mb-4">
                            About the Project
                        </p>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 leading-tight">
                            When 150 tanneries moved to Savar, the problem
                            didn&apos;t disappear — it moved to the Dhaleshwari.
                        </h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                In 2017, Bangladesh relocated its leather
                                industry from Hazaribagh to a new estate in
                                Hemayetpur. The Central Effluent Treatment Plant
                                has never operated at full capacity. Chromium,
                                sulfides, and organic waste pour into the river
                                daily.
                            </p>
                            <p>
                                We went to the communities living closest to the
                                discharge zone — Longkarchar and Jihbakata
                                villages in Keraniganj — and spoke to 56
                                families face-to-face about what they see,
                                smell, and suffer.
                            </p>
                            <p>
                                This project is supported by the National
                                Geographic Society, The Nature Conservancy, and
                                Extern.
                            </p>
                        </div>

                        <div className="mt-8 pt-8 border-t border-border">
                            <blockquote className="font-serif text-lg italic text-foreground/80">
                                &ldquo;Tannery waste should not be discharged
                                into the river. More submersible pumps are
                                needed.&rdquo;
                            </blockquote>
                            <p className="text-sm text-muted-foreground mt-2">
                                — Resident, Longkarchar village
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
