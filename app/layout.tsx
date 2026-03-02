import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import "katex/dist/katex.min.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
});

const playfair = Playfair_Display({
    variable: "--font-playfair",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Dhaleshwari River Pollution Awareness",
    description:
        "Student-led environmental research and public health campaign documenting industrial pollution in the Dhaleshwari River, Bangladesh. Supported by National Geographic Society, The Nature Conservancy, and Extern.",
    keywords: [
        "Dhaleshwari River",
        "water pollution",
        "environmental research",
        "community health",
        "Bangladesh",
        "tannery pollution",
        "freshwater",
        "public health",
        "Extern",
        "National Geographic Society",
        "The Nature Conservancy",
        "field research",
        "policy advocacy",
    ],
    authors: [{ name: "Santo Kabir Ahmed" }],
    openGraph: {
        title: "Dhaleshwari River Pollution Awareness",
        description:
            "Student-led research and public health campaign on industrial river pollution in Bangladesh.",
        type: "website",
        locale: "en_US",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth" suppressHydrationWarning>
            <body
                className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster position="top-center" richColors />
                </ThemeProvider>
            </body>
        </html>
    );
}
