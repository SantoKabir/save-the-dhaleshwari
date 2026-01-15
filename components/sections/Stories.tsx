"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
    {
        name: "Md. Hazrat Ali",
        age: 54,
        location: "Lonkarchar Village",
        quote:
            "Before I would easily get 1,000tk per day from fishing. Now I get 12,000tk per month from tannery work. Can a family run on only 9,000tk after expenses? Impossible.",
        image: "/images/From_left__Hazrat,_Shopon,_Monir,_Tara.jpg",
    },
    {
        name: "Shopon Hossain",
        age: 39,
        location: "Lonkarchar Village",
        quote:
            "We, the local people, cannot do anything. These are thousand-crore corporations. But if you try, as a student, as your requests are heeded, maybe you can bring change.",
        image: "/images/From_left__Hazrat,_Shopon,_Monir,_Tara.jpg",
    },
    {
        name: "Abu Taher",
        age: 73,
        location: "Lonkarchar Village",
        quote:
            "The fish are not as plentiful as they used to be. I catch only what I need to feed myself. Only the rainy season brings in some fish now.",
        image: "/images/Abu_Taher_tending_to_his_nets.jpg",
    },
];

export function Stories() {
    return (
        <section id="stories" className="py-20 md:py-32 bg-muted/30">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    className="text-center max-w-3xl mx-auto mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
                        Voices from the River
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Real stories from the communities whose lives have been forever
                        changed by industrial pollution.
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.name}
                            className="bg-card border border-border rounded-2xl overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="font-semibold">{testimonial.name}</h3>
                                    <p className="text-sm text-white/70">
                                        Age {testimonial.age}, {testimonial.location}
                                    </p>
                                </div>
                            </div>

                            {/* Quote */}
                            <div className="p-6">
                                <Quote className="h-6 w-6 text-primary mb-4" />
                                <p className="text-muted-foreground italic leading-relaxed">
                                    &ldquo;{testimonial.quote}&rdquo;
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
