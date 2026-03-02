"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const FaqItemSchema = z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
    sort_order: z.number().int().default(0),
    is_published: z.boolean().default(true),
});

export async function getFaqItems() {
    return prisma.faqItem.findMany({ orderBy: { sort_order: "asc" } });
}

export async function createFaqItem(data: z.infer<typeof FaqItemSchema>) {
    const parsed = FaqItemSchema.parse(data);
    const item = await prisma.faqItem.create({ data: parsed });
    revalidatePath("/faq");
    revalidatePath("/admin/dashboard");
    return item;
}

export async function updateFaqItem(id: string, data: Partial<z.infer<typeof FaqItemSchema>>) {
    const item = await prisma.faqItem.update({ where: { id }, data });
    revalidatePath("/faq");
    revalidatePath("/admin/dashboard");
    return item;
}

export async function deleteFaqItem(id: string) {
    await prisma.faqItem.delete({ where: { id } });
    revalidatePath("/faq");
    revalidatePath("/admin/dashboard");
}
