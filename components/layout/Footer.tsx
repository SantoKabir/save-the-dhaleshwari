import Link from "next/link";
import Image from "next/image";
import { Mail, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-foreground text-background py-16">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* About */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Save the Dhaleshwari</h3>
                        <p className="text-background/70 text-sm leading-relaxed">
                            An environmental conservation program fighting against industrial
                            pollution in the Dhaleshwari River, Bangladesh.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/"
                                    className="text-background/70 hover:text-background transition-colors"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/gallery"
                                    className="text-background/70 hover:text-background transition-colors"
                                >
                                    Gallery
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/faq"
                                    className="text-background/70 hover:text-background transition-colors"
                                >
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="https://storymaps.arcgis.com/stories/a0551ceb5b9f4b739674f4b6fa8e1d7e"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-background/70 hover:text-background transition-colors"
                                >
                                    Read the Full Story
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Contact</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2 text-background/70">
                                <Mail className="h-4 w-4" />
                                <a
                                    href="mailto:santoahmed01@gmail.com"
                                    className="hover:text-background transition-colors"
                                >
                                    santoahmed01@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center gap-2 text-background/70">
                                <Linkedin className="h-4 w-4" />
                                <a
                                    href="https://www.linkedin.com/in/santo-kabir-ahmed"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-background transition-colors"
                                >
                                    Santo Kabir Ahmed
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Partners */}
                <div className="mt-12 pt-8 border-t border-background/20">
                    <p className="text-center text-sm text-background/50 mb-6">
                        In collaboration with
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8">
                        <span className="text-sm md:text-base font-semibold text-background/70 hover:text-background transition-colors">
                            National Geographic Society
                        </span>
                        <span className="text-background/30">•</span>
                        <Image
                            src="/logos/extern.svg"
                            alt="Extern"
                            width={100}
                            height={32}
                            className="h-8 w-auto invert opacity-70 hover:opacity-100 transition-opacity"
                        />
                        <span className="text-background/30">•</span>
                        <span className="text-sm md:text-base font-semibold text-background/70 hover:text-background transition-colors">
                            The Nature Conservancy
                        </span>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 text-center text-sm text-background/40">
                    <p>© {new Date().getFullYear()} Save the Dhaleshwari. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
