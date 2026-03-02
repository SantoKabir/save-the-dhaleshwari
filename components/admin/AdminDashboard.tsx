"use client";

import { useState } from "react";
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import {
    LogOut,
    Users,
    MessageSquare,
    CalendarDays,
    Megaphone,
    Droplets,
} from "lucide-react";
import { TeamAdmin } from "./tabs/TeamAdmin";
import { FaqAdmin } from "./tabs/FaqAdmin";
import { EventsAdmin } from "./tabs/EventsAdmin";
import { AnnouncementsAdmin } from "./tabs/AnnouncementsAdmin";
import type {
    TeamMember,
    FaqItem,
    Event,
    EventMedia,
    Announcement,
    Division,
} from "@/lib/generated/prisma";
import { ThemeToggle } from "@/components/layout/Header";

type Tab = "team" | "faq" | "events" | "announcements";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "team", label: "Team Members", icon: Users },
    { id: "faq", label: "FAQ", icon: MessageSquare },
    { id: "events", label: "Events", icon: CalendarDays },
    { id: "announcements", label: "Announcements", icon: Megaphone },
];

interface AdminDashboardProps {
    userEmail: string;
    teamMembers: (TeamMember & { division: Division | null })[];
    faqItems: FaqItem[];
    events: (Event & { media: EventMedia[] })[];
    announcements: Announcement[];
    divisions: Division[];
}

export function AdminDashboard({
    userEmail,
    teamMembers,
    faqItems,
    events,
    announcements,
    divisions,
}: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState<Tab>("team");

    return (
        <div className="min-h-screen bg-background">
            {/* Top bar */}
            <header className="border-b border-border bg-card">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <Droplets className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold">DRPA Admin</p>
                            <p className="text-xs text-muted-foreground">
                                {userEmail}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                    <form action={signOut}>
                        <Button type="submit" variant="ghost" size="sm">
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign out
                        </Button>
                    </form>
                    <ThemeToggle />
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Tab nav */}
                <nav className="flex gap-1 mb-8 border-b border-border pb-0">
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
                                ${
                                    activeTab === id
                                        ? "border-primary text-primary"
                                        : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            {label}
                        </button>
                    ))}
                </nav>

                {/* Tab content */}
                {activeTab === "team" && (
                    <TeamAdmin
                        initialMembers={teamMembers}
                        initialDivisions={divisions}
                    />
                )}
                {activeTab === "faq" && <FaqAdmin initialItems={faqItems} />}
                {activeTab === "events" && (
                    <EventsAdmin initialEvents={events} />
                )}
                {activeTab === "announcements" && (
                    <AnnouncementsAdmin initialAnnouncements={announcements} />
                )}
            </div>
        </div>
    );
}
