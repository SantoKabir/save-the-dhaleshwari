import { prisma } from "@/lib/prisma";
import { EventDetailClient } from "./EventDetailClient";
import { evaluate } from "@mdx-js/mdx";
import * as jsxRuntime from "react/jsx-runtime";
import * as jsxDevRuntime from "react/jsx-dev-runtime";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { StatCard, DataTable } from "@/components/mdx/StatCard";
import { VideoEmbed } from "@/components/mdx/VideoEmbed";
import { ChartEmbed } from "@/components/mdx/ChartEmbed";
import type { ReactNode } from "react";
import { Fragment } from "react";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const events = await prisma.event
        .findMany({ where: { is_published: true }, select: { slug: true } })
        .catch(() => []);
    return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const event = await prisma.event
        .findUnique({
            where: { slug },
            select: { title: true, summary: true, cover_image_url: true },
        })
        .catch(() => null);
    if (!event) return { title: "Event Not Found" };
    return {
        title: `${event.title} | Dhaleshwari River Pollution Awareness`,
        description: event.summary ?? undefined,
        openGraph: {
            title: event.title,
            description: event.summary ?? undefined,
            ...(event.cover_image_url
                ? { images: [{ url: event.cover_image_url }] }
                : {}),
        },
    };
}

export default async function EventDetailPage({ params }: PageProps) {
    const { slug } = await params;

    const event = await prisma.event
        .findUnique({
            where: { slug, is_published: true },
            include: { media: { orderBy: { sort_order: "asc" } } },
        })
        .catch(() => null);

    if (!event) {
        const { notFound } = await import("next/navigation");
        notFound();
    }

    // After notFound() check, event is guaranteed to exist
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentEvent = event!;

    // Compile and evaluate MDX with JSX expression support
    // Using @mdx-js/mdx evaluate to properly handle JSX expressions like arrays/objects
    const runtime = process.env.NODE_ENV === "development" ? jsxDevRuntime : jsxRuntime;

    const evaluated = await evaluate(currentEvent.description, {
        ...runtime,
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [rehypeKatex],
        Fragment,
    });

    // The evaluated module exports a default component
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MDXContent = evaluated.default as React.FC<{ components?: Record<string, React.ComponentType<any>> }>;

    // Create the MDX content with components available
    const mdxContent: ReactNode = <MDXContent components={{ StatCard, DataTable, VideoEmbed, ChartEmbed }} />;

    // Fetch adjacent events for prev/next navigation
    const [prevEvent, nextEvent] = await Promise.all([
        prisma.event
            .findFirst({
                where: {
                    is_published: true,
                    event_date: { lt: currentEvent.event_date },
                },
                orderBy: { event_date: "desc" },
                select: { slug: true, title: true },
            })
            .catch(() => null),
        prisma.event
            .findFirst({
                where: {
                    is_published: true,
                    event_date: { gt: currentEvent.event_date },
                },
                orderBy: { event_date: "asc" },
                select: { slug: true, title: true },
            })
            .catch(() => null),
    ]);

    const tags = Array.isArray(currentEvent.tags)
        ? (currentEvent.tags as string[])
        : [];

    return (
        <EventDetailClient
            event={{
                id: currentEvent.id,
                title: currentEvent.title,
                slug: currentEvent.slug,
                summary: currentEvent.summary,
                event_date: currentEvent.event_date.toISOString(),
                location: currentEvent.location,
                cover_image_url: currentEvent.cover_image_url,
                is_highlighted: currentEvent.is_highlighted,
                is_published: currentEvent.is_published,
                tags,
                media: currentEvent.media.map((m) => ({
                    id: m.id,
                    media_url: m.media_url,
                    media_type: m.media_type,
                    caption: m.caption,
                    sort_order: m.sort_order,
                })),
                created_at: currentEvent.created_at.toISOString(),
                updated_at: currentEvent.updated_at?.toISOString() ?? null,
            }}
            mdxContent={mdxContent}
            prevEvent={prevEvent}
            nextEvent={nextEvent}
            tags={tags}
        />
    );
}
