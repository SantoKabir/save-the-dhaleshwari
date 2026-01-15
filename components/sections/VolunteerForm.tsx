"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    Award,
    FileText,
    Coins,
    Clock,
    MapPin,
    Users,
    Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { volunteerSchema, type VolunteerFormData } from "@/lib/validations/volunteer";
import { submitVolunteerApplication } from "@/app/actions/volunteer";

const benefits = [
    { icon: Award, label: "Prestigious Certification" },
    { icon: FileText, label: "Recommendation Letters" },
    { icon: Coins, label: "Food, Travel & Allowances" },
];

const requirements = [
    { icon: Users, label: "Students aged 18-24" },
    { icon: MapPin, label: "Near Savar or willing to travel" },
    { icon: Clock, label: "3-4 hours/week, 4-5 months" },
];

export function VolunteerForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<VolunteerFormData>({
        resolver: zodResolver(volunteerSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            university: "",
            motivation: "",
        },
    });

    async function onSubmit(data: VolunteerFormData) {
        setIsSubmitting(true);

        try {
            const result = await submitVolunteerApplication(data);

            if (result.success) {
                toast.success("Application submitted!", {
                    description: "Thank you for joining the fight!",
                });
                router.push("/thank-you");
            } else {
                toast.error("Submission failed", {
                    description: result.message,
                });
            }
        } catch (error) {
            toast.error("Something went wrong", {
                description: "Please try again later.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section id="volunteer" className="py-20 md:py-32 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4">
                <motion.div
                    className="text-center max-w-3xl mx-auto mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
                        Become a Guardian
                    </h2>
                    <p className="text-lg text-primary-foreground/80">
                        Join our team of student volunteers fighting to restore the
                        Dhaleshwari River.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Left: Benefits & Requirements */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        {/* Requirements */}
                        <div className="mb-10">
                            <h3 className="text-xl font-semibold mb-6">Who Can Apply</h3>
                            <div className="space-y-4">
                                {requirements.map((req) => (
                                    <div key={req.label} className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
                                            <req.icon className="h-5 w-5" />
                                        </div>
                                        <span>{req.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Benefits */}
                        <div>
                            <h3 className="text-xl font-semibold mb-6">What You Get</h3>
                            <div className="space-y-4">
                                {benefits.map((benefit) => (
                                    <div key={benefit.label} className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                                            <benefit.icon className="h-5 w-5 text-accent" />
                                        </div>
                                        <span>{benefit.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Form */}
                    <motion.div
                        className="bg-background text-foreground rounded-2xl p-8"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your full name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+880..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="university"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>University/College *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Your university or college"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="motivation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Why do you want to volunteer? *</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Tell us what motivates you to join this cause..."
                                                    className="min-h-[120px] resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit Application"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
