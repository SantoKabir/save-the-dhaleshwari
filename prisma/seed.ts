import { PrismaClient, MemberStatus, MediaType } from "../lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set in .env.local");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
    console.log("🌱 Seeding database...");

    // ─── Divisions ───────────────────────────────────────────────────────────────
    await prisma.teamMember.deleteMany();
    await prisma.division.deleteMany();

    const [researchDiv, techDiv, outreachDiv] = await Promise.all([
        prisma.division.create({ data: { name: "Research" } }),
        prisma.division.create({ data: { name: "Technology" } }),
        prisma.division.create({ data: { name: "Outreach" } }),
    ]);
    console.log("✅ Divisions seeded");

    // ─── Team Members ───────────────────────────────────────────────────────────
    await prisma.teamMember.createMany({
        data: [
            {
                name: "Santo Kabir Ahmed",
                bio: "Lead researcher and founder of the Dhaleshwari River Pollution Awareness initiative. Graduate researcher specializing in environmental chemistry and community health impact assessment. Conducted the landmark January 2026 survey across riverside communities.",
                email: "santo@drpa.org",
                is_leader: true,
                is_public: true,
                status: MemberStatus.ACTIVE,
                sort_order: 0,
                division_id: researchDiv.id,
            },
            {
                name: "Raufun Nasher",
                bio: "Full-stack developer and technical lead for the DRPA digital platform. Manages data infrastructure and web presence for the initiative.",
                is_public: true,
                status: MemberStatus.ACTIVE,
                sort_order: 1,
                division_id: techDiv.id,
            },
            {
                name: "Fatema Khatun",
                bio: "Field researcher and community liaison. Coordinates with local riverside communities to gather health impact data and raise awareness.",
                is_public: true,
                status: MemberStatus.ACTIVE,
                sort_order: 2,
                division_id: outreachDiv.id,
            },
            {
                name: "Dr. Mizanur Rahman",
                bio: "Consultant hydrologist with expertise in chromium contamination. Provided technical guidance on water sampling and heavy metal analysis.",
                is_public: true,
                status: MemberStatus.FORMER,
                sort_order: 3,
                division_id: researchDiv.id,
            },
        ],
    });
    console.log("✅ Team members seeded");

    // ─── FAQ Items ───────────────────────────────────────────────────────────────
    await prisma.faqItem.deleteMany();

    await prisma.faqItem.createMany({
        data: [
            {
                question: "What is the Dhaleshwari River Pollution Awareness initiative?",
                answer: "The Dhaleshwari River Pollution Awareness (DRPA) initiative is a community-driven research project documenting the environmental and public health impacts of industrial pollution — particularly from the tannery industry relocation — along the Dhaleshwari River in Bangladesh.",
                sort_order: 0,
                is_published: true,
            },
            {
                question: "What pollutants are most concerning in the Dhaleshwari River?",
                answer: "Our research has identified hexavalent chromium (Cr⁶⁺) as the primary concern, with measured concentrations up to 10× the safe drinking water threshold. We have also detected elevated levels of sulfide compounds, dissolved organic solids, and ammonia nitrogen, all associated with tannery effluent.",
                sort_order: 1,
                is_published: true,
            },
            {
                question: "What health impacts have been documented in riverside communities?",
                answer: "Our January 2026 community survey (n=150+) found that 53% of respondents reported skin rashes and dermatological conditions directly linked to river water exposure. A Cramér's V correlation of 0.72 was measured between proximity to tannery discharge points and reported illness frequency — indicating a strong association.",
                sort_order: 2,
                is_published: true,
            },
            {
                question: "What was the 2017 tannery relocation and why does it matter?",
                answer: "In 2017, the Bangladesh government relocated approximately 155 tanneries from Hazaribagh (Dhaka) to the Savar Tannery Industrial Estate (STIE), adjacent to the Dhaleshwari River. While the relocation was intended to reduce pollution in central Dhaka, the new site lacked a fully operational Central Effluent Treatment Plant (CETP), transferring the pollution burden to the Dhaleshwari watershed.",
                sort_order: 3,
                is_published: true,
            },
            {
                question: "How can I support or get involved?",
                answer: "You can follow our research updates on the Events page, share our findings with your network, or contact us directly via the team page to explore collaboration opportunities. We partner with NGOs, academic institutions, and government agencies working on environmental justice.",
                sort_order: 4,
                is_published: true,
            },
            {
                question: "Is the research data publicly available?",
                answer: "We are committed to open science. Survey data, water quality measurements, and analysis reports are published through our Events & Research page as events are completed and reviewed. We plan to release a full open dataset by Q4 2026.",
                sort_order: 5,
                is_published: true,
            },
        ],
    });
    console.log("✅ FAQ items seeded");

    // ─── Events ──────────────────────────────────────────────────────────────────
    await prisma.eventMedia.deleteMany();
    await prisma.event.deleteMany();

    const event1 = await prisma.event.create({
        data: {
            title: "January 2026 Community Health Survey",
            slug: "january-2026-community-health-survey",
            summary: "A landmark community-based health impact survey across 12 riverside villages, documenting the correlation between tannery discharge and illness rates in affected populations.",
            description: `## Overview

The January 2026 Community Health Survey was conducted across **12 villages** along a 30 km stretch of the Dhaleshwari River, capturing health data from over 150 households directly dependent on the river for irrigation, fishing, and domestic use.

## Key Findings

<StatCard
  stats={[
    { label: "Survey Respondents", value: 150, suffix: "+" },
    { label: "Skin Rash Prevalence", value: 53, suffix: "%" },
    { label: "Chromium vs. Safe Limit", value: 10, suffix: "×" },
    { label: "Cramér\'s V Correlation", value: 0.72 }
  ]}
/>

## Methodology

Household interviews were conducted using a structured questionnaire covering:
- Frequency and type of river water contact
- Self-reported illness history (past 12 months)
- Proximity to discharge outfall points
- Access to piped/treated water alternatives

Water samples were collected at 8 sampling points and analyzed for chromium (total and hexavalent), pH, dissolved oxygen, and biological oxygen demand.

## Statistical Analysis

The association between river exposure and reported illness was quantified using Cramér's V:

$$V = \\sqrt{\\frac{\\chi^2}{n \\cdot \\min(r-1, c-1)}}$$

A value of **V = 0.72** indicates a strong association between proximity to tannery discharge and illness rates.

## Chromium Levels by Sampling Point

<ChartEmbed
  type="bar"
  title="Hexavalent Chromium Concentration (mg/L)"
  labels={["Point A", "Point B", "Point C", "Point D", "Point E", "Point F", "Point G", "Point H"]}
  datasets={[
    {
      label: "Cr⁶⁺ (mg/L)",
      data: [2.1, 4.8, 5.2, 3.9, 0.8, 0.3, 0.1, 0.2],
      backgroundColor: "rgba(14, 165, 233, 0.7)"
    },
    {
      label: "WHO Safe Limit (0.05 mg/L)",
      data: [0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05],
      backgroundColor: "rgba(239, 68, 68, 0.5)"
    }
  ]}
/>

## Next Steps

Based on this survey, we are preparing a formal policy brief for submission to the Department of Environment (DoE) Bangladesh, recommending mandatory CETP compliance monitoring and independent water quality audits at quarterly intervals.
`,
            event_date: new Date("2026-01-15"),
            location: "Savar, Dhaka District, Bangladesh",
            is_highlighted: true,
            is_published: true,
            tags: ["survey", "health", "chromium", "field-research"],
            media: {
                create: [
                    {
                        media_url: "https://mlclyuyldzigblmpaazd.supabase.co/storage/v1/object/public/media/images/survey-team.jpg",
                        media_type: MediaType.IMAGE,
                        caption: "Survey team briefing before fieldwork",
                        sort_order: 0,
                    },
                ],
            },
        },
    });

    const _event2 = await prisma.event.create({
        data: {
            title: "Water Sampling Campaign — August 2025",
            slug: "water-sampling-august-2025",
            summary: "Baseline water quality measurements collected at 8 points along the Dhaleshwari to establish pre-monsoon contamination profiles.",
            description: `## Campaign Summary

A pre-monsoon baseline water sampling campaign was conducted in August 2025 at 8 strategically selected points along the Dhaleshwari River.

## Parameters Measured

- Hexavalent chromium (Cr⁶⁺) and total chromium
- pH, temperature, dissolved oxygen (DO)
- Biochemical oxygen demand (BOD) and chemical oxygen demand (COD)
- Total dissolved solids (TDS)
- Sulfide concentration

## Results Summary

All sampling points within 5 km downstream of the STIE discharge outfall showed chromium concentrations exceeding WHO guidelines by a factor of 3–10×.

This baseline data serves as the reference dataset for the January 2026 community health survey correlation analysis.
`,
            event_date: new Date("2025-08-10"),
            location: "Dhaleshwari River, Savar",
            is_highlighted: false,
            is_published: true,
            tags: ["water-sampling", "baseline", "chemistry"],
        },
    });

    console.log("✅ Events seeded:", event1.slug);

    // ─── Announcements ───────────────────────────────────────────────────────────
    await prisma.announcement.deleteMany();

    await prisma.announcement.createMany({
        data: [
            {
                title: "Survey Report Now Available",
                content: "The full findings of our January 2026 Community Health Survey are now published. Explore the data, statistical analysis, and policy recommendations on the Events page.",
                link_url: "/events/january-2026-community-health-survey",
                is_active: true,
                display_from: new Date("2026-02-01"),
                display_until: new Date("2026-06-30"),
                sort_order: 0,
            },
            {
                title: "Seeking Research Collaborators",
                content: "We are looking for academic partners in environmental science, public health, and policy advocacy to join our upcoming Phase 2 research. Contact the team to learn more.",
                is_active: true,
                display_from: new Date("2026-01-01"),
                sort_order: 1,
            },
        ],
    });
    console.log("✅ Announcements seeded");

    console.log("🎉 Database seeded successfully!");
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error("Seed error:", e);
        await prisma.$disconnect();
        process.exit(1);
    });
