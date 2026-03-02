import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TeamHero } from "@/components/sections/TeamHero";
import { TeamLeaderShowcase } from "@/components/sections/TeamLeaderShowcase";
import { TeamGrid } from "@/components/sections/TeamGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Our Team | Dhaleshwari River Pollution Awareness",
    description:
        "Meet the students and researchers behind the Dhaleshwari River Pollution Awareness initiative.",
};

export default async function TeamPage() {
    const members = await prisma.teamMember
        .findMany({
            where: { is_public: true },
            orderBy: [{ is_leader: "desc" }, { sort_order: "asc" }],
            include: { division: true },
        })
        .catch(() => []);

    const leader = members.find((m) => m.is_leader);
    const team = members.filter((m) => !m.is_leader);

    return (
        <>
            <Header />
            <main className="pt-16">
                <TeamHero memberCount={team.length + (leader ? 1 : 0)} />

                {leader && <TeamLeaderShowcase leader={leader} />}

                {team.length > 0 && <TeamGrid members={team} />}

                {members.length === 0 && (
                    <section className="py-32 text-center text-muted-foreground">
                        <p className="text-lg">Team information coming soon.</p>
                    </section>
                )}
            </main>
            <Footer />
        </>
    );
}
