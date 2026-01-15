"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Linkedin, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProjectLead() {
    return (
        <section id="project-lead" className="py-20 md:py-32">
            <div className="container mx-auto px-4">
                <motion.div
                    className="max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="bg-card border border-border rounded-3xl overflow-hidden">
                        <div className="grid md:grid-cols-2 gap-0">
                            {/* Image */}
                            <div className="relative aspect-square md:aspect-auto">
                                <Image
                                    src="/images/santo_kabir_ahmed.jpg"
                                    alt="Santo Kabir Ahmed"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-8 md:p-12 flex flex-col justify-center">
                                <p className="text-sm font-medium text-primary mb-2">
                                    Meet Your Project Lead
                                </p>
                                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                                    Santo Kabir Ahmed
                                </h2>

                                <div className="flex items-center gap-2 text-muted-foreground mb-6">
                                    <GraduationCap className="h-5 w-5" />
                                    <span>
                                        Student of Soil, Water and Environment
                                        <br />
                                        Dhaka University, Bangladesh
                                    </span>
                                </div>

                                <p className="text-muted-foreground leading-relaxed mb-8">
                                    Witnessing the steady decline of my country&apos;s natural beauty
                                    has made me passionate about conservation and sustainability.
                                    Through this program, I aim to give a voice to the voiceless
                                    communities affected by industrial pollution.
                                </p>

                                {/* Contact */}
                                <div className="space-y-3">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        asChild
                                    >
                                        <a href="mailto:santoahmed01@gmail.com">
                                            <Mail className="h-4 w-4 mr-3" />
                                            santoahmed01@gmail.com
                                        </a>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        asChild
                                    >
                                        <a
                                            href="https://www.linkedin.com/in/santo-kabir-ahmed"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Linkedin className="h-4 w-4 mr-3" />
                                            Connect on LinkedIn
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
