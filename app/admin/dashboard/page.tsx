import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/admin");

    const [teamMembers, faqItems, events, announcements, divisions] =
        await Promise.all([
            prisma.teamMember
                .findMany({
                    orderBy: [{ is_leader: "desc" }, { sort_order: "asc" }],
                    include: { division: true },
                })
                .catch(() => []),
            prisma.faqItem
                .findMany({ orderBy: { sort_order: "asc" } })
                .catch(() => []),
            prisma.event
                .findMany({
                    orderBy: { event_date: "desc" },
                    include: { media: true },
                })
                .catch(() => []),
            prisma.announcement
                .findMany({ orderBy: { sort_order: "asc" } })
                .catch(() => []),
            prisma.division
                .findMany({ orderBy: { name: "asc" } })
                .catch(() => []),
        ]);

    return (
        <AdminDashboard
            userEmail={user.email ?? ""}
            teamMembers={teamMembers}
            faqItems={faqItems}
            events={events}
            announcements={announcements}
            divisions={divisions}
        />
    );
}
