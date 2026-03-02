"use client";

import { useState, useRef, useTransition } from "react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { deleteFile } from "@/app/actions/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MDXBlockEditor } from "@/components/admin/mdx-editor/MDXBlockEditor";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Plus,
    Pencil,
    Trash2,
    Check,
    X,
    ExternalLink,
    Video,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
    createEvent,
    updateEvent,
    deleteEvent,
    addEventMedia,
    updateEventMedia,
    deleteEventMedia,
} from "@/app/actions/events";
import type { Event, EventMedia } from "@/lib/generated/prisma";

type EventWithMedia = Event & { media: EventMedia[] };

interface EventsAdminProps {
    initialEvents: EventWithMedia[];
}

const EMPTY = {
    title: "",
    slug: "",
    summary: "",
    description: "",
    cover_image_url: "",
    event_date: new Date().toISOString().split("T")[0],
    location: "",
    is_highlighted: false,
    is_published: false,
    tags: "",
};

export function EventsAdmin({ initialEvents }: EventsAdminProps) {
    const [events, setEvents] = useState(initialEvents);
    const [editing, setEditing] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(EMPTY);
    const [isPending, startTransition] = useTransition();

    const toCreateData = (f: typeof EMPTY) => ({
        title: f.title,
        slug: f.slug,
        summary: f.summary,
        description: f.description,
        cover_image_url: f.cover_image_url,
        event_date: new Date(f.event_date),
        location: f.location,
        is_highlighted: f.is_highlighted,
        is_published: f.is_published,
        tags: f.tags
            ? f.tags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
            : [],
    });

    const handleCreate = () => {
        startTransition(async () => {
            try {
                const event = await createEvent(toCreateData(form));
                setEvents((prev) => [{ ...event, media: [] }, ...prev]);
                setForm(EMPTY);
                setShowForm(false);
                toast.success("Event created");
            } catch (e: unknown) {
                toast.error(
                    e instanceof Error ? e.message : "Failed to create event",
                );
            }
        });
    };

    const handleUpdate = (id: string) => {
        startTransition(async () => {
            try {
                const event = await updateEvent(id, toCreateData(form));
                setEvents((prev) =>
                    prev.map((e) =>
                        e.id === id ? { ...event, media: e.media } : e,
                    ),
                );
                setEditing(null);
                toast.success("Event updated");
            } catch (e: unknown) {
                toast.error(
                    e instanceof Error ? e.message : "Failed to update event",
                );
            }
        });
    };

    const handleDelete = (id: string) => {
        if (!confirm("Delete this event and all its media?")) return;
        startTransition(async () => {
            try {
                const event = events.find((e) => e.id === id);
                if (event?.cover_image_url) {
                    await deleteFile(event.cover_image_url);
                }
                for (const m of event?.media ?? []) {
                    if (m.media_url) await deleteFile(m.media_url);
                }
                await deleteEvent(id);
                setEvents((prev) => prev.filter((e) => e.id !== id));
                toast.success("Event deleted");
            } catch {
                toast.error("Failed to delete event");
            }
        });
    };

    const startEdit = (event: EventWithMedia) => {
        setEditing(event.id);
        setShowForm(false);
        setForm({
            title: event.title,
            slug: event.slug,
            summary: event.summary,
            description: event.description,
            cover_image_url: event.cover_image_url ?? "",
            event_date: new Date(event.event_date).toISOString().split("T")[0],
            location: event.location ?? "",
            is_highlighted: event.is_highlighted,
            is_published: event.is_published,
            tags: Array.isArray(event.tags)
                ? (event.tags as string[]).join(", ")
                : "",
        });
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                    Events ({events.length})
                </h2>
                <Button
                    size="sm"
                    onClick={() => {
                        setShowForm(true);
                        setEditing(null);
                        setForm(EMPTY);
                    }}
                >
                    <Plus className="h-4 w-4 mr-1" /> Add Event
                </Button>
            </div>

            {showForm && (
                <EventForm
                    form={form}
                    setForm={setForm}
                    onSubmit={handleCreate}
                    onCancel={() => setShowForm(false)}
                    isPending={isPending}
                    title="Add Event"
                    originalUrl=""
                />
            )}

            <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Published</TableHead>
                            <TableHead>Highlighted</TableHead>
                            <TableHead className="w-32">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="text-center text-muted-foreground py-8"
                                >
                                    No events yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            events.map((event) => (
                                <>
                                    <TableRow key={event.id}>
                                        <TableCell className="font-medium max-w-xs truncate">
                                            {event.title}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                            {new Date(
                                                event.event_date,
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {event.is_published ? (
                                                <Check className="h-4 w-4 text-accent" />
                                            ) : (
                                                <X className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {event.is_highlighted ? (
                                                <Check className="h-4 w-4 text-primary" />
                                            ) : (
                                                "—"
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/events/${event.slug}`}
                                                        target="_blank"
                                                    >
                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() =>
                                                        startEdit(event)
                                                    }
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                                    onClick={() =>
                                                        handleDelete(event.id)
                                                    }
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {editing === event.id && (
                                        <TableRow key={`edit-${event.id}`}>
                                            <TableCell
                                                colSpan={5}
                                                className="p-0"
                                            >
                                                <div className="p-4 bg-muted/30 border-t border-border">
                                                    <EventForm
                                                        form={form}
                                                        setForm={setForm}
                                                        onSubmit={() =>
                                                            handleUpdate(
                                                                event.id,
                                                            )
                                                        }
                                                        onCancel={() =>
                                                            setEditing(null)
                                                        }
                                                        isPending={isPending}
                                                        title="Edit Event"
                                                        originalUrl={
                                                            event.cover_image_url ??
                                                            ""
                                                        }
                                                        eventId={event.id}
                                                        eventMedia={event.media}
                                                        onMediaChange={(
                                                            media,
                                                        ) =>
                                                            setEvents((prev) =>
                                                                prev.map((e) =>
                                                                    e.id ===
                                                                    event.id
                                                                        ? {
                                                                              ...e,
                                                                              media,
                                                                          }
                                                                        : e,
                                                                ),
                                                            )
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

// ── EventMediaManager ────────────────────────────────────────────────────────
function EventMediaManager({
    eventId,
    initialMedia,
    onMediaChange,
}: {
    eventId: string;
    initialMedia: EventMedia[];
    onMediaChange: (media: EventMedia[]) => void;
}) {
    const [media, setMedia] = useState<EventMedia[]>(initialMedia);
    const [isPending, startTransition] = useTransition();
    const [newUrl, setNewUrl] = useState("");
    const [newCaption, setNewCaption] = useState("");
    const [newMediaType, setNewMediaType] = useState<
        "IMAGE" | "VIDEO" | "CHART"
    >("IMAGE");
    const uploadRef = useRef<string | null>(null);

    const handleAdd = () => {
        if (!newUrl) return;
        startTransition(async () => {
            try {
                const item = await addEventMedia({
                    event_id: eventId,
                    media_url: newUrl,
                    media_type: newMediaType,
                    caption: newCaption || undefined,
                    sort_order: media.length,
                });
                const next = [...media, item];
                setMedia(next);
                onMediaChange(next);
                uploadRef.current = null;
                setNewUrl("");
                setNewCaption("");
                toast.success("Media added");
            } catch {
                toast.error("Failed to add media");
            }
        });
    };

    const handleDelete = (id: string, url: string) => {
        startTransition(async () => {
            try {
                await deleteFile(url);
                await deleteEventMedia(id);
                const next = media.filter((m) => m.id !== id);
                setMedia(next);
                onMediaChange(next);
                toast.success("Media deleted");
            } catch {
                toast.error("Failed to delete media");
            }
        });
    };

    const handleCaptionBlur = (id: string, caption: string) => {
        updateEventMedia(id, { caption }).catch(() =>
            toast.error("Failed to update caption"),
        );
    };

    return (
        <div className="border border-border rounded-xl p-4 space-y-4">
            <p className="text-sm font-semibold">Event Media Gallery</p>
            {media.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {media.map((m) => (
                        <div
                            key={m.id}
                            className="group relative border border-border rounded-lg overflow-hidden"
                        >
                            {m.media_type === "IMAGE" ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={m.media_url}
                                    alt={m.caption ?? ""}
                                    className="w-full aspect-video object-cover"
                                />
                            ) : (
                                <div className="w-full aspect-video bg-muted flex items-center justify-center">
                                    <Video className="h-8 w-8 text-muted-foreground" />
                                    <span className="ml-2 text-xs text-muted-foreground">
                                        {m.media_type}
                                    </span>
                                </div>
                            )}
                            <div className="p-2">
                                <Input
                                    defaultValue={m.caption ?? ""}
                                    placeholder="Caption…"
                                    className="h-7 text-xs"
                                    onBlur={(e) =>
                                        handleCaptionBlur(m.id, e.target.value)
                                    }
                                />
                            </div>
                            <button
                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full h-5 w-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDelete(m.id, m.media_url)}
                                disabled={isPending}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {/* Add new media */}
            <div className="border-t border-border pt-4 space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Add Media
                </p>
                <div className="flex gap-2 items-center">
                    <select
                        value={newMediaType}
                        onChange={(e) =>
                            setNewMediaType(
                                e.target.value as "IMAGE" | "VIDEO" | "CHART",
                            )
                        }
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                        <option value="IMAGE">Image</option>
                        <option value="VIDEO">Video</option>
                        <option value="CHART">Chart image</option>
                    </select>
                </div>
                {newMediaType === "IMAGE" ? (
                    <ImageUploadField
                        value={newUrl}
                        onChange={setNewUrl}
                        folder="images"
                        label=""
                        cleanupRef={uploadRef}
                    />
                ) : (
                    <Input
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        placeholder={
                            newMediaType === "VIDEO"
                                ? "Video URL (Supabase storage)"
                                : "Chart image URL"
                        }
                    />
                )}
                <Input
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    placeholder="Caption (optional)"
                />
                <Button
                    size="sm"
                    onClick={handleAdd}
                    disabled={!newUrl || isPending}
                >
                    <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
            </div>
        </div>
    );
}

function EventForm({
    form,
    setForm,
    onSubmit,
    onCancel,
    isPending,
    title,
    originalUrl,
    eventId,
    eventMedia,
    onMediaChange,
}: {
    form: typeof EMPTY;
    setForm: React.Dispatch<React.SetStateAction<typeof EMPTY>>;
    onSubmit: () => void;
    onCancel: () => void;
    isPending: boolean;
    title: string;
    originalUrl: string;
    eventId?: string;
    eventMedia?: EventMedia[];
    onMediaChange?: (media: EventMedia[]) => void;
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
                        placeholder="Event title"
                    />
                </div>
                <div>
                    <Label>Slug *</Label>
                    <Input
                        value={form.slug}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                slug: e.target.value
                                    .toLowerCase()
                                    .replace(/\s+/g, "-"),
                            }))
                        }
                        placeholder="url-friendly-slug"
                    />
                </div>
                <div>
                    <Label>Date *</Label>
                    <Input
                        type="date"
                        value={form.event_date}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                event_date: e.target.value,
                            }))
                        }
                    />
                </div>
                <div>
                    <Label>Location</Label>
                    <Input
                        value={form.location}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, location: e.target.value }))
                        }
                        placeholder="City, Country"
                    />
                </div>
                <div>
                    <ImageUploadField
                        value={form.cover_image_url}
                        onChange={(url) =>
                            setForm((f) => ({ ...f, cover_image_url: url }))
                        }
                        folder="images"
                        label="Cover Image"
                        cleanupRef={cleanupRef}
                    />
                </div>
                <div className="sm:col-span-2">
                    <Label>Summary *</Label>
                    <Textarea
                        value={form.summary}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, summary: e.target.value }))
                        }
                        rows={2}
                        placeholder="Short summary for event cards..."
                    />
                </div>
                <div className="sm:col-span-2">
                    <MDXBlockEditor
                        value={form.description}
                        onChange={(mdx) =>
                            setForm((f) => ({ ...f, description: mdx }))
                        }
                        label="Content"
                    />
                </div>
                <div className="sm:col-span-2">
                    <Label>Tags (comma-separated)</Label>
                    <Input
                        value={form.tags}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, tags: e.target.value }))
                        }
                        placeholder="field-research, survey, chromium"
                    />
                </div>
                {eventId && (
                    <div className="sm:col-span-2">
                        <EventMediaManager
                            eventId={eventId}
                            initialMedia={eventMedia ?? []}
                            onMediaChange={onMediaChange ?? (() => {})}
                        />
                    </div>
                )}
                <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.is_published}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    is_published: e.target.checked,
                                }))
                            }
                        />
                        Published
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.is_highlighted}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    is_highlighted: e.target.checked,
                                }))
                            }
                        />
                        Highlighted (homepage)
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
