"use client";

import { useState, useRef, useTransition } from "react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { deleteFile } from "@/app/actions/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";
import {
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
} from "@/app/actions/announcements";
import type { Announcement } from "@/lib/generated/prisma";

interface AnnouncementsAdminProps {
    initialAnnouncements: Announcement[];
}

const EMPTY = {
    title: "",
    content: "",
    image_url: "",
    link_url: "",
    is_active: true,
    display_from: new Date().toISOString().split("T")[0],
    display_until: "",
    sort_order: "0",
};

export function AnnouncementsAdmin({
    initialAnnouncements,
}: AnnouncementsAdminProps) {
    const [announcements, setAnnouncements] = useState(initialAnnouncements);
    const [editing, setEditing] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(EMPTY);
    const [isPending, startTransition] = useTransition();

    const toData = (f: typeof EMPTY) => ({
        title: f.title,
        content: f.content,
        image_url: f.image_url,
        link_url: f.link_url,
        is_active: f.is_active,
        display_from: new Date(f.display_from),
        display_until: f.display_until ? new Date(f.display_until) : null,
        sort_order: parseInt(f.sort_order, 10) || 0,
    });

    const handleCreate = () => {
        startTransition(async () => {
            try {
                const ann = await createAnnouncement(toData(form));
                setAnnouncements((prev) => [ann, ...prev]);
                setForm(EMPTY);
                setShowForm(false);
                toast.success("Announcement created");
            } catch (e: unknown) {
                toast.error(
                    e instanceof Error
                        ? e.message
                        : "Failed to create announcement",
                );
            }
        });
    };

    const handleUpdate = (id: string) => {
        startTransition(async () => {
            try {
                const ann = await updateAnnouncement(id, toData(form));
                setAnnouncements((prev) =>
                    prev.map((a) => (a.id === id ? ann : a)),
                );
                setEditing(null);
                toast.success("Announcement updated");
            } catch (e: unknown) {
                toast.error(
                    e instanceof Error
                        ? e.message
                        : "Failed to update announcement",
                );
            }
        });
    };

    const handleDelete = (id: string) => {
        if (!confirm("Delete this announcement?")) return;
        startTransition(async () => {
            try {
                const ann = announcements.find((a) => a.id === id);
                if (ann?.image_url) {
                    await deleteFile(ann.image_url);
                }
                await deleteAnnouncement(id);
                setAnnouncements((prev) => prev.filter((a) => a.id !== id));
                toast.success("Announcement deleted");
            } catch {
                toast.error("Failed to delete announcement");
            }
        });
    };

    const startEdit = (ann: Announcement) => {
        setEditing(ann.id);
        setShowForm(false);
        setForm({
            title: ann.title,
            content: ann.content,
            image_url: ann.image_url ?? "",
            link_url: ann.link_url ?? "",
            is_active: ann.is_active,
            display_from: new Date(ann.display_from)
                .toISOString()
                .split("T")[0],
            display_until: ann.display_until
                ? new Date(ann.display_until).toISOString().split("T")[0]
                : "",
            sort_order: String(ann.sort_order),
        });
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                    Announcements ({announcements.length})
                </h2>
                <Button
                    size="sm"
                    onClick={() => {
                        setShowForm(true);
                        setEditing(null);
                        setForm(EMPTY);
                    }}
                >
                    <Plus className="h-4 w-4 mr-1" /> Add Announcement
                </Button>
            </div>

            {showForm && (
                <AnnForm
                    form={form}
                    setForm={setForm}
                    onSubmit={handleCreate}
                    onCancel={() => setShowForm(false)}
                    isPending={isPending}
                    title="Add Announcement"
                    originalUrl=""
                />
            )}

            <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Active</TableHead>
                            <TableHead>Display From</TableHead>
                            <TableHead>Until</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead className="w-24">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {announcements.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center text-muted-foreground py-8"
                                >
                                    No announcements yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            announcements.map((ann) => (
                                <>
                                    <TableRow key={ann.id}>
                                        <TableCell className="font-medium max-w-xs truncate">
                                            {ann.title}
                                        </TableCell>
                                        <TableCell>
                                            {ann.is_active ? (
                                                <Check className="h-4 w-4 text-accent" />
                                            ) : (
                                                <X className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                            {new Date(
                                                ann.display_from,
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                            {ann.display_until
                                                ? new Date(
                                                      ann.display_until,
                                                  ).toLocaleDateString()
                                                : "—"}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {ann.sort_order}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() =>
                                                        startEdit(ann)
                                                    }
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                                    onClick={() =>
                                                        handleDelete(ann.id)
                                                    }
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {editing === ann.id && (
                                        <TableRow key={`edit-${ann.id}`}>
                                            <TableCell
                                                colSpan={6}
                                                className="p-0"
                                            >
                                                <div className="p-4 bg-muted/30 border-t border-border">
                                                    <AnnForm
                                                        form={form}
                                                        setForm={setForm}
                                                        onSubmit={() =>
                                                            handleUpdate(ann.id)
                                                        }
                                                        onCancel={() =>
                                                            setEditing(null)
                                                        }
                                                        isPending={isPending}
                                                        title="Edit Announcement"
                                                        originalUrl={
                                                            ann.image_url ?? ""
                                                        }
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

function AnnForm({
    form,
    setForm,
    onSubmit,
    onCancel,
    isPending,
    title,
    originalUrl,
}: {
    form: typeof EMPTY;
    setForm: React.Dispatch<React.SetStateAction<typeof EMPTY>>;
    onSubmit: () => void;
    onCancel: () => void;
    isPending: boolean;
    title: string;
    originalUrl: string;
}) {
    const cleanupRef = useRef<string | null>(null);
    const handleCancel = () => {
        if (cleanupRef.current && cleanupRef.current !== originalUrl) {
            deleteFile(cleanupRef.current); // fire-and-forget: clean up session upload
        }
        onCancel();
    };
    return (
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <h3 className="font-semibold mb-4">{title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                    <Label>Title *</Label>
                    <Input
                        value={form.title}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, title: e.target.value }))
                        }
                        placeholder="Announcement title"
                    />
                </div>
                <div className="sm:col-span-2">
                    <Label>Content *</Label>
                    <Textarea
                        value={form.content}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, content: e.target.value }))
                        }
                        rows={4}
                        placeholder="Announcement text..."
                    />
                </div>
                <div>
                    <ImageUploadField
                        value={form.image_url}
                        onChange={(url) =>
                            setForm((f) => ({ ...f, image_url: url }))
                        }
                        folder="images"
                        label="Image"
                        cleanupRef={cleanupRef}
                    />
                </div>
                <div>
                    <Label>Link URL</Label>
                    <Input
                        value={form.link_url}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, link_url: e.target.value }))
                        }
                        placeholder="https://..."
                    />
                </div>
                <div>
                    <Label>Display From *</Label>
                    <Input
                        type="date"
                        value={form.display_from}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                display_from: e.target.value,
                            }))
                        }
                    />
                </div>
                <div>
                    <Label>Display Until (optional)</Label>
                    <Input
                        type="date"
                        value={form.display_until}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                display_until: e.target.value,
                            }))
                        }
                    />
                </div>
                <div>
                    <Label>Sort Order</Label>
                    <Input
                        type="number"
                        value={form.sort_order}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                sort_order: e.target.value,
                            }))
                        }
                        placeholder="0"
                    />
                </div>
                <div className="flex items-center">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.is_active}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    is_active: e.target.checked,
                                }))
                            }
                        />
                        Active
                    </label>
                </div>
            </div>
            <div className="flex gap-2 mt-4">
                <Button onClick={onSubmit} disabled={isPending} size="sm">
                    Save
                </Button>
                <Button variant="ghost" onClick={handleCancel} size="sm">
                    Cancel
                </Button>
            </div>
        </div>
    );
}
