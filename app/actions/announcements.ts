"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const AnnouncementSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    image_url: z.string().url().optional().or(z.literal("")),
    link_url: z.string().url().optional().or(z.literal("")),
    is_active: z.boolean().default(true),
    display_from: z.coerce.date().default(() => new Date()),
    display_until: z.coerce.date().optional().nullable(),
    sort_order: z.number().int().default(0),
});

export async function getAnnouncements() {
    return prisma.announcement.findMany({ orderBy: { sort_order: "asc" } });
}

export async function createAnnouncement(data: z.infer<typeof AnnouncementSchema>) {
    const parsed = AnnouncementSchema.parse(data);
    const item = await prisma.announcement.create({
        data: {
            ...parsed,
            image_url: parsed.image_url || null,
            link_url: parsed.link_url || null,
        },
    });
    revalidatePath("/events");
    revalidatePath("/admin/dashboard");
    return item;
}

export async function updateAnnouncement(id: string, data: Partial<z.infer<typeof AnnouncementSchema>>) {
    const item = await prisma.announcement.update({
        where: { id },
        data: {
            ...data,
            image_url: data.image_url || null,
            link_url: data.link_url || null,
        },
    });
    revalidatePath("/events");
    revalidatePath("/admin/dashboard");
    return item;
}

export async function deleteAnnouncement(id: string) {
    await prisma.announcement.delete({ where: { id } });
    revalidatePath("/events");
    revalidatePath("/admin/dashboard");
}
