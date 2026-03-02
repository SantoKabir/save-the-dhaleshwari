import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://save-the-dhaleshwari.vercel.app";
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/admin/", "/admin/dashboard/", "/admin/settings/", "/admin/forgot-password/", "admin/reset-password/"],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
