"use client";

import { useState, useTransition } from "react";
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
import { createFaqItem, updateFaqItem, deleteFaqItem } from "@/app/actions/faq";
import type { FaqItem } from "@/lib/generated/prisma";

interface FaqAdminProps {
    initialItems: FaqItem[];
}

const EMPTY = { question: "", answer: "", sort_order: 0, is_published: true };

export function FaqAdmin({ initialItems }: FaqAdminProps) {
    const [items, setItems] = useState(initialItems);
    const [editing, setEditing] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(EMPTY);
    const [isPending, startTransition] = useTransition();

    const handleCreate = () => {
        startTransition(async () => {
            try {
                const item = await createFaqItem({
                    ...form,
                    sort_order: Number(form.sort_order),
                });
                setItems((prev) => [...prev, item]);
                setForm(EMPTY);
                setShowForm(false);
                toast.success("FAQ item created");
            } catch {
                toast.error("Failed to create FAQ item");
            }
        });
    };

    const handleUpdate = (id: string) => {
        startTransition(async () => {
            try {
                const item = await updateFaqItem(id, {
                    ...form,
                    sort_order: Number(form.sort_order),
                });
                setItems((prev) => prev.map((i) => (i.id === id ? item : i)));
                setEditing(null);
                toast.success("FAQ item updated");
            } catch {
                toast.error("Failed to update FAQ item");
            }
        });
    };

    const handleDelete = (id: string) => {
        if (!confirm("Delete this FAQ item?")) return;
        startTransition(async () => {
            try {
                await deleteFaqItem(id);
                setItems((prev) => prev.filter((i) => i.id !== id));
                toast.success("FAQ item deleted");
            } catch {
                toast.error("Failed to delete FAQ item");
            }
        });
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                    FAQ Items ({items.length})
                </h2>
                <Button
                    size="sm"
                    onClick={() => {
                        setShowForm(true);
                        setEditing(null);
                        setForm(EMPTY);
                    }}
                >
                    <Plus className="h-4 w-4 mr-1" /> Add FAQ
                </Button>
            </div>

            {showForm && (
                <FAQForm
                    form={form}
                    setForm={setForm}
                    onSubmit={handleCreate}
                    onCancel={() => setShowForm(false)}
                    isPending={isPending}
                    title="Add FAQ Item"
                />
            )}

            <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Question</TableHead>
                            <TableHead>Published</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead className="w-24">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="text-center text-muted-foreground py-8"
                                >
                                    No FAQ items yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((item) => (
                                <>
                                    <TableRow key={item.id}>
                                        <TableCell className="max-w-xs truncate font-medium">
                                            {item.question}
                                        </TableCell>
                                        <TableCell>
                                            {item.is_published ? (
                                                <Check className="h-4 w-4 text-accent" />
                                            ) : (
                                                <X className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </TableCell>
                                        <TableCell>{item.sort_order}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => {
                                                        setEditing(item.id);
                                                        setShowForm(false);
                                                        setForm({
                                                            question:
                                                                item.question,
                                                            answer: item.answer,
                                                            sort_order:
                                                                item.sort_order,
                                                            is_published:
                                                                item.is_published,
                                                        });
                                                    }}
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {editing === item.id && (
                                        <TableRow key={`edit-${item.id}`}>
                                            <TableCell
                                                colSpan={4}
                                                className="p-0"
                                            >
                                                <div className="p-4 bg-muted/30 border-t border-border">
                                                    <FAQForm
                                                        form={form}
                                                        setForm={setForm}
                                                        onSubmit={() =>
                                                            handleUpdate(
                                                                item.id,
                                                            )
                                                        }
                                                        onCancel={() =>
                                                            setEditing(null)
                                                        }
                                                        isPending={isPending}
                                                        title="Edit FAQ Item"
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

function FAQForm({
    form,
    setForm,
    onSubmit,
    onCancel,
    isPending,
    title,
}: {
    form: typeof EMPTY;
    setForm: React.Dispatch<React.SetStateAction<typeof EMPTY>>;
    onSubmit: () => void;
    onCancel: () => void;
    isPending: boolean;
    title: string;
}) {
    return (
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <h3 className="font-semibold mb-4">{title}</h3>
            <div className="space-y-4">
                <div>
                    <Label>Question *</Label>
                    <Input
                        value={form.question}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, question: e.target.value }))
                        }
                        placeholder="Question..."
                    />
                </div>
                <div>
                    <Label>Answer *</Label>
                    <Textarea
                        value={form.answer}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, answer: e.target.value }))
                        }
                        rows={4}
                        placeholder="Answer..."
                    />
                </div>
                <div className="flex gap-4">
                    <div className="w-32">
                        <Label>Order</Label>
                        <Input
                            type="number"
                            value={form.sort_order}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    sort_order: parseInt(e.target.value) || 0,
                                }))
                            }
                        />
                    </div>
                    <label className="flex items-center gap-2 text-sm cursor-pointer mt-6">
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
                </div>
            </div>
            <div className="flex gap-2 mt-4">
                <Button onClick={onSubmit} disabled={isPending} size="sm">
                    Save
                </Button>
                <Button variant="ghost" onClick={onCancel} size="sm">
                    Cancel
                </Button>
            </div>
        </div>
    );
}
