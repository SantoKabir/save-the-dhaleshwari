import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
    title: "FAQ | Save the Dhaleshwari",
    description: "Frequently asked questions about the Save the Dhaleshwari volunteer program.",
};

const faqs = [
    {
        question: "What is the Save the Dhaleshwari program?",
        answer:
            "Save the Dhaleshwari is an environmental conservation program focused on combating industrial pollution in the Dhaleshwari River, caused primarily by the BSCIC Tannery Industrial Estate in Savar, Bangladesh. We work through documentation, community engagement, education, and advocacy.",
    },
    {
        question: "Who can volunteer?",
        answer:
            "We welcome college and university students aged 18-24 who have a deep interest in environmental conservation. You should be located near Savar or willing to travel for on-site activities.",
    },
    {
        question: "What is the time commitment?",
        answer:
            "Volunteers are expected to commit 3-4 hours per week for a period of 4-5 months. This includes attending meetings, teaching awareness classes, and participating in on-site drives.",
    },
    {
        question: "What will I do as a volunteer?",
        answer:
            "Your responsibilities may include: hosting and coordinating meetings, teaching awareness classes to local students, participating in on-site awareness drives in Savar and affected villages, and helping document the pollution and its effects.",
    },
    {
        question: "What benefits will I receive?",
        answer:
            "Volunteers receive a prestigious certification upon completion, recommendation letters for future opportunities, and allowances covering food, travel, and event accessories.",
    },
    {
        question: "Is this a paid position?",
        answer:
            "This is a volunteer position. While it is not a paid role, we provide allowances to cover your expenses related to the program activities.",
    },
    {
        question: "How can I learn more about the pollution crisis?",
        answer:
            "You can read the full investigative story 'Two Rivers, One Poison' on ArcGIS StoryMaps, which documents the history, current situation, and human impact of the tannery pollution.",
    },
    {
        question: "Who is behind this program?",
        answer:
            "The program is led by Santo Kabir Ahmed, a student of Soil, Water and Environment at Dhaka University. It is supported by National Geographic Society, The Nature Conservancy, and Extern.",
    },
    {
        question: "How do I apply?",
        answer:
            "You can apply by filling out the volunteer application form on our homepage. Simply click 'Become a Guardian' and submit your details. We'll review your application and get back to you within a few days.",
    },
    {
        question: "Can I contribute in other ways if I can't volunteer?",
        answer:
            "Absolutely! You can help by spreading awareness, sharing our story on social media, demanding sustainable products from leather brands, or engaging with environmental NGOs like BAPA and BELA.",
    },
];

export default function FAQPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen pt-16">
                <div className="container mx-auto px-4 py-20">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Find answers to common questions about our program and how you can
                            get involved.
                        </p>
                    </div>

                    {/* FAQ Accordion */}
                    <div className="max-w-3xl mx-auto">
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="text-left">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
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
