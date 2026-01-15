"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function Hope() {
    return (
        <section id="hope" className="relative py-20 md:py-32 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/images/People_bathing_in_the_river_in_Lonkarchar_village.jpg"
                    alt="People bathing in the clean monsoon waters"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4">
                <motion.div
                    className="max-w-3xl mx-auto text-center text-white"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8">
                        There Is Hope
                    </h2>

                    <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed">
                        The rivers are naturally resilient, dynamic systems that, given
                        enough time, can bounce back to their previous vigor. Every monsoon,
                        the waters wash away the pollution and bring fresh fish &mdash;
                        proof that nature wants to heal.
                    </p>

                    <blockquote className="border-l-4 border-accent pl-6 text-left">
                        <p className="text-xl md:text-2xl italic font-serif mb-4">
                            &ldquo;Our lives begin to end the day we become silent about the
                            things that really matter.&rdquo;
                        </p>
                        <cite className="text-white/60 not-italic">
                            &mdash; Martin Luther King Jr.
                        </cite>
                    </blockquote>

                    <p className="text-lg text-white/70 mt-10">
                        There is still a long way to go before we can truly save the
                        Dhaleshwari. But every small step, every voice counts. It is time
                        for us to raise our voice and save the rivers that give us life.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
