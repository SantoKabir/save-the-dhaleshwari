import Link from "next/link";
import Image from "next/image";
import { Mail, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-footer text-footer-foreground py-16">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* About */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">
                            Dhaleshwari River Pollution Awareness
                        </h3>
                        <p className="text-footer-foreground/60 text-sm leading-relaxed">
                            A student-led environmental research and public
                            health campaign documenting industrial pollution in
                            the Dhaleshwari River, Bangladesh — turning data
                            into advocacy.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/"
                                    className="text-footer-foreground/60 hover:text-footer-foreground transition-colors"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/events"
                                    className="text-footer-foreground/60 hover:text-footer-foreground transition-colors"
                                >
                                    Events
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/team"
                                    className="text-footer-foreground/60 hover:text-footer-foreground transition-colors"
                                >
                                    Team
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/faq"
                                    className="text-footer-foreground/60 hover:text-footer-foreground transition-colors"
                                >
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Contact</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2 text-footer-foreground/60">
                                <Mail className="h-4 w-4" />
                                <a
                                    href="mailto:santoahmed01@gmail.com"
                                    className="hover:text-footer-foreground transition-colors"
                                >
                                    santoahmed01@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center gap-2 text-footer-foreground/60">
                                <Linkedin className="h-4 w-4" />
                                <a
                                    href="https://www.linkedin.com/in/santo-kabir-ahmed"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-footer-foreground transition-colors"
                                >
                                    Santo Kabir Ahmed
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Partners */}
                <div className="mt-12 pt-8 border-t border-footer-foreground/10">
                    <p className="text-center text-sm text-footer-foreground/40 mb-6">
                        In collaboration with
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8">
                        <span className="text-sm md:text-base font-semibold text-footer-foreground/60 hover:text-footer-foreground transition-colors">
                            National Geographic Society
                        </span>
                        <span className="text-footer-foreground/20">•</span>
                        <Image
                            src="/logos/extern.svg"
                            alt="Extern"
                            width={100}
                            height={32}
                            className="h-8 w-auto invert opacity-60 hover:opacity-90 transition-opacity"
                        />
                        <span className="text-footer-foreground/20">•</span>
                        <span className="text-sm md:text-base font-semibold text-footer-foreground/60 hover:text-footer-foreground transition-colors">
                            The Nature Conservancy
                        </span>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 text-center text-sm text-footer-foreground/30">
                    <p>
                        © {new Date().getFullYear()} Dhaleshwari River Pollution
                        Awareness. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
