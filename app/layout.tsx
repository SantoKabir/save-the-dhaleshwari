import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

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
  title: "Save the Dhaleshwari | Join the Fight Against Pollution",
  description:
    "Join the fight against pollution. Be the voice for the river and the community. Volunteer with the Save the Dhaleshwari program supported by National Geographic Society, The Nature Conservancy, and Extern.",
  keywords: [
    "Dhaleshwari River",
    "environmental conservation",
    "volunteer",
    "Bangladesh",
    "pollution",
    "tannery",
    "freshwater",
    'extern',
    'national geographic society',
    'the nature conservency society'
  ],
  authors: [{ name: "Santo Kabir Ahmed" }],
  openGraph: {
    title: "Save the Dhaleshwari",
    description: "Join the fight against pollution. Be the voice for the river and the community.",
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
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
