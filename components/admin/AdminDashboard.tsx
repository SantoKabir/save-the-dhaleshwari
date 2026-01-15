"use client";

import { useState } from "react";
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { LogOut, Search, Eye, Users, Calendar, Mail, Download } from "lucide-react";
import ExcelJS from "exceljs";

interface Application {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    age: number | null;
    university: string;
    motivation: string;
    created_at: string;
}

interface AdminDashboardProps {
    applications: Application[];
    userEmail: string;
}

export function AdminDashboard({ applications, userEmail }: AdminDashboardProps) {
    const [search, setSearch] = useState("");
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);

    const filteredApps = applications.filter(
        (app) =>
            app.name.toLowerCase().includes(search.toLowerCase()) ||
            app.email.toLowerCase().includes(search.toLowerCase()) ||
            app.university.toLowerCase().includes(search.toLowerCase())
    );

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    async function exportToExcel() {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Applications");

        // Add header row
        worksheet.columns = [
            { header: "Name", key: "name", width: 25 },
            { header: "Email", key: "email", width: 30 },
            { header: "Phone", key: "phone", width: 15 },
            { header: "Age", key: "age", width: 8 },
            { header: "University", key: "university", width: 35 },
            { header: "Motivation", key: "motivation", width: 50 },
            { header: "Submitted At", key: "submitted", width: 20 },
        ];

        // Style header row
        worksheet.getRow(1).font = { bold: true };

        // Add data rows
        applications.forEach((app) => {
            worksheet.addRow({
                name: app.name,
                email: app.email,
                phone: app.phone || "",
                age: app.age || "",
                university: app.university,
                motivation: app.motivation,
                submitted: formatDate(app.created_at),
            });
        });

        // Generate and download file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const date = new Date().toISOString().split("T")[0];
        link.download = `volunteer_applications_${date}.xlsx`;
        link.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <header className="bg-card border-b border-border sticky top-0 z-10">
                <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Admin Dashboard</h1>
                        <p className="text-sm text-muted-foreground">{userEmail}</p>
                    </div>
                    <form action={signOut}>
                        <Button type="submit" variant="outline">
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </Button>
                    </form>
                </div>
            </header>

            {/* Main Content */}
            <main className="container max-w-7xl mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-card border border-border rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{applications.length}</p>
                                <p className="text-sm text-muted-foreground">
                                    Total Applications
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                                <Calendar className="h-6 w-6 text-accent" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {applications.filter(
                                        (a) =>
                                            new Date(a.created_at) >
                                            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                                    ).length}
                                </p>
                                <p className="text-sm text-muted-foreground">This Week</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                                <Mail className="h-6 w-6 text-destructive" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {applications.filter(
                                        (a) =>
                                            new Date(a.created_at) >
                                            new Date(Date.now() - 24 * 60 * 60 * 1000)
                                    ).length}
                                </p>
                                <p className="text-sm text-muted-foreground">Today</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Export */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, email, or university..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button onClick={exportToExcel} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export to Excel
                    </Button>
                </div>

                {/* Applications Table */}
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>University</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredApps.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        <p className="text-muted-foreground">
                                            No applications found
                                        </p>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredApps.map((app) => (
                                    <TableRow key={app.id}>
                                        <TableCell className="font-medium">{app.name}</TableCell>
                                        <TableCell>{app.email}</TableCell>
                                        <TableCell>{app.university}</TableCell>
                                        <TableCell>{formatDate(app.created_at)}</TableCell>
                                        <TableCell className="text-right">
                                            <Sheet>
                                                <SheetTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSelectedApp(app)}
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View
                                                    </Button>
                                                </SheetTrigger>
                                                <SheetContent className="w-full sm:max-w-lg">
                                                    <SheetHeader>
                                                        <SheetTitle>Application Details</SheetTitle>
                                                    </SheetHeader>
                                                    {selectedApp && (
                                                        <div className="mt-6 space-y-6">
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Name
                                                                </p>
                                                                <p className="font-medium">
                                                                    {selectedApp.name}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Email
                                                                </p>
                                                                <a
                                                                    href={`mailto:${selectedApp.email}`}
                                                                    className="font-medium text-primary hover:underline"
                                                                >
                                                                    {selectedApp.email}
                                                                </a>
                                                            </div>
                                                            {selectedApp.phone && (
                                                                <div>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        Phone
                                                                    </p>
                                                                    <p className="font-medium">
                                                                        {selectedApp.phone}
                                                                    </p>
                                                                </div>
                                                            )}
                                                            {selectedApp.age && (
                                                                <div>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        Age
                                                                    </p>
                                                                    <p className="font-medium">
                                                                        {selectedApp.age}
                                                                    </p>
                                                                </div>
                                                            )}
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">
                                                                    University
                                                                </p>
                                                                <p className="font-medium">
                                                                    {selectedApp.university}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Motivation
                                                                </p>
                                                                <p className="font-medium leading-relaxed">
                                                                    {selectedApp.motivation}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Submitted
                                                                </p>
                                                                <p className="font-medium">
                                                                    {formatDate(selectedApp.created_at)}
                                                                </p>
                                                            </div>
                                                            <Button
                                                                className="w-full"
                                                                asChild
                                                            >
                                                                <a href={`mailto:${selectedApp.email}`}>
                                                                    <Mail className="h-4 w-4 mr-2" />
                                                                    Send Email
                                                                </a>
                                                            </Button>
                                                        </div>
                                                    )}
                                                </SheetContent>
                                            </Sheet>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </main>
        </div>
    );
}
