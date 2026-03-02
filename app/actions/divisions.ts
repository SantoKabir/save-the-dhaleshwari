"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getDivisions() {
    return prisma.division.findMany({ orderBy: { name: "asc" } });
}

export async function createDivision(name: string) {
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Division name is required");

    const division = await prisma.division.create({ data: { name: trimmed } });
    revalidatePath("/admin/dashboard");
    revalidatePath("/team");
    return division;
}

export async function deleteDivision(id: string) {
    // Unassign members first, then delete
    await prisma.teamMember.updateMany({
        where: { division_id: id },
        data: { division_id: null },
    });
    await prisma.division.delete({ where: { id } });
    revalidatePath("/admin/dashboard");
    revalidatePath("/team");
}
