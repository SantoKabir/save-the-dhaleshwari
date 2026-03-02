"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { MediaType } from "@/lib/generated/prisma";

const EventSchema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
    summary: z.string().min(1),
    description: z.string().default(""),
    cover_image_url: z.string().url().optional().or(z.literal("")),
    event_date: z.coerce.date(),
    location: z.string().optional(),
    is_highlighted: z.boolean().default(false),
    is_published: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
});

export async function getEvents() {
    return prisma.event.findMany({
        orderBy: { event_date: "desc" },
        include: { media: { orderBy: { sort_order: "asc" } } },
    });
}

export async function getEventBySlug(slug: string) {
    return prisma.event.findUnique({
        where: { slug },
        include: { media: { orderBy: { sort_order: "asc" } } },
    });
}

export async function createEvent(data: z.infer<typeof EventSchema>) {
    const parsed = EventSchema.parse(data);
    const event = await prisma.event.create({
        data: {
            ...parsed,
            cover_image_url: parsed.cover_image_url || null,
            tags: parsed.tags,
        },
    });
    revalidatePath("/events");
    revalidatePath("/");
    return event;
}

export async function updateEvent(id: string, data: Partial<z.infer<typeof EventSchema>>) {
    const event = await prisma.event.update({
        where: { id },
        data: {
            ...data,
            cover_image_url: data.cover_image_url || null,
        },
    });
    revalidatePath("/events");
    revalidatePath(`/events/${event.slug}`);
    revalidatePath("/");
    return event;
}

export async function deleteEvent(id: string) {
    const event = await prisma.event.findUnique({ where: { id }, select: { slug: true } });
    await prisma.event.delete({ where: { id } });
    revalidatePath("/events");
    revalidatePath("/");
    if (event) revalidatePath(`/events/${event.slug}`);
}

// ─── EventMedia ──────────────────────────────────────────────────────────────

export async function addEventMedia(data: {
    event_id: string;
    media_url: string;
    media_type: MediaType;
    caption?: string;
    sort_order?: number;
}) {
    const media = await prisma.eventMedia.create({ data });
    revalidatePath("/events");
    return media;
}

export async function updateEventMedia(id: string, data: { caption?: string; sort_order?: number }) {
    return prisma.eventMedia.update({ where: { id }, data });
}

export async function deleteEventMedia(id: string) {
    await prisma.eventMedia.delete({ where: { id } });
}
