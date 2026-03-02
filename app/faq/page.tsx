import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "FAQ | Dhaleshwari River Pollution Awareness",
    description:
        "Frequently asked questions about the Dhaleshwari River Pollution Awareness research initiative.",
};

export default async function FAQPage() {
    const faqs = await prisma.faqItem
        .findMany({
            where: { is_published: true },
            orderBy: { sort_order: "asc" },
        })
        .catch(() => []);

    return (
        <>
            <Header />
            <main className="min-h-screen pt-16">
                <div className="container mx-auto px-4 py-20">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <p className="text-primary text-sm uppercase tracking-widest font-medium mb-3">
                            Learn More
                        </p>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Find answers to common questions about our research
                            initiative, findings, and how you can get involved.
                        </p>
                    </div>

                    {/* FAQ Accordion */}
                    <div className="max-w-3xl mx-auto">
                        {faqs.length > 0 ? (
                            <Accordion
                                type="single"
                                collapsible
                                className="w-full"
                            >
                                {faqs.map((faq) => (
                                    <AccordionItem key={faq.id} value={faq.id}>
                                        <AccordionTrigger className="text-left">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        ) : (
                            <p className="text-center text-muted-foreground py-12">
                                FAQ content coming soon.
                            </p>
                        )}
                    </div>

                    {/* CTA */}
                    <div className="text-center mt-16">
                        <p className="text-muted-foreground mb-4">
                            Still have questions?
                        </p>
                        <a
                            href="mailto:santoahmed01@gmail.com"
                            className="text-primary hover:underline font-medium"
                        >
                            Contact Santo directly →
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
