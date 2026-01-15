import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Heart, ArrowRight } from "lucide-react";

export default function ThankYouPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen flex items-center justify-center pt-16">
                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-2xl mx-auto text-center">
                        {/* Success Icon */}
                        <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-8">
                            <CheckCircle className="h-10 w-10 text-accent" />
                        </div>

                        {/* Heading */}
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                            Thank You, Guardian!
                        </h1>

                        {/* Message */}
                        <p className="text-lg text-muted-foreground mb-4">
                            Your application has been submitted successfully. We&apos;re thrilled
                            to have you join the fight to save the Dhaleshwari River.
                        </p>

                        <p className="text-muted-foreground mb-10">
                            We will review your application and get back to you within a few
                            days. In the meantime, feel free to explore more about the crisis.
                        </p>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button asChild size="lg">
                                <Link href="/">
                                    <ArrowRight className="mr-2 h-4 w-4" />
                                    Back to Home
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" asChild>
                                <a
                                    href="https://storymaps.arcgis.com/stories/a0551ceb5b9f4b739674f4b6fa8e1d7e"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Read the Full Story
                                </a>
                            </Button>
                        </div>

                        {/* Heart */}
                        <div className="mt-16 flex items-center justify-center gap-2 text-muted-foreground">
                            <Heart className="h-5 w-5 text-destructive" />
                            <span>Together, we can make a difference.</span>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
