import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://save-the-dhaleshwari.vercel.app";

    const events = await prisma.event
        .findMany({
            where: { is_published: true },
            select: { slug: true, updated_at: true },
        })
        .catch(() => []);

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
        { url: `${baseUrl}/events`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
        { url: `${baseUrl}/team`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
        { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    ];

    const eventRoutes: MetadataRoute.Sitemap = events.map((e) => ({
        url: `${baseUrl}/events/${e.slug}`,
        lastModified: e.updated_at,
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }));

    return [...staticRoutes, ...eventRoutes];
}
