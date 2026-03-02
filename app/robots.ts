import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dhaleshwari.org";
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/admin/", "/admin/dashboard/"],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
