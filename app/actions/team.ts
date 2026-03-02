"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { MemberStatus } from "@/lib/generated/prisma";

const TeamMemberSchema = z.object({
    name: z.string().min(1),
    bio: z.string().min(1),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    picture_url: z.string().optional(),
    is_leader: z.boolean().default(false),
    is_public: z.boolean().default(true),
    status: z.nativeEnum(MemberStatus).default(MemberStatus.ACTIVE),
    sort_order: z.number().int().default(0),
    division_id: z.string().nullable().optional(),
});

export async function getTeamMembers() {
    return prisma.teamMember.findMany({
        orderBy: [{ is_leader: "desc" }, { sort_order: "asc" }],
        include: { division: true },
    });
}

export async function createTeamMember(data: z.infer<typeof TeamMemberSchema>) {
    const parsed = TeamMemberSchema.parse(data);
    const { division_id, ...rest } = parsed;
    const member = await prisma.teamMember.create({
        data: {
            ...rest,
            email: rest.email || null,
            ...(division_id
                ? { division: { connect: { id: division_id } } }
                : {}),
        },
        include: { division: true },
    });
    revalidatePath("/team");
    revalidatePath("/admin/dashboard");
    return member;
}

export async function updateTeamMember(id: string, data: Partial<z.infer<typeof TeamMemberSchema>>) {
    const { division_id, ...rest } = data;
    const divisionRelation =
        division_id === undefined
            ? {}
            : division_id
                ? { division: { connect: { id: division_id } } }
                : { division: { disconnect: true } };
    const member = await prisma.teamMember.update({
        where: { id },
        data: {
            ...rest,
            email: rest.email || null,
            ...divisionRelation,
        },
        include: { division: true },
    });
    revalidatePath("/team");
    revalidatePath("/admin/dashboard");
    return member;
}

export async function deleteTeamMember(id: string) {
    await prisma.teamMember.delete({ where: { id } });
    revalidatePath("/team");
    revalidatePath("/admin/dashboard");
}
