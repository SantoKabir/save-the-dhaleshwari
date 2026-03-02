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
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
} from "@/app/actions/team";
import { createDivision } from "@/app/actions/divisions";
import { MemberStatus } from "@/lib/generated/prisma";
import type { TeamMember, Division } from "@/lib/generated/prisma";

interface TeamAdminProps {
    initialMembers: (TeamMember & { division: Division | null })[];
    initialDivisions: Division[];
}

type MemberForm = {
    name: string;
    bio: string;
    email: string;
    phone: string;
    picture_url: string;
    is_leader: boolean;
    is_public: boolean;
    status: MemberStatus;
    sort_order: number;
    division_id: string;
    new_division_name: string;
};

const EMPTY_FORM: MemberForm = {
    name: "",
    bio: "",
    email: "",
    phone: "",
    picture_url: "",
    is_leader: false,
    is_public: true,
    status: MemberStatus.ACTIVE,
    sort_order: 0,
    division_id: "",
    new_division_name: "",
};

export function TeamAdmin({
    initialMembers,
    initialDivisions,
}: TeamAdminProps) {
    const [members, setMembers] = useState(initialMembers);
    const [divisions, setDivisions] = useState(initialDivisions);
    const [editing, setEditing] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [isPending, startTransition] = useTransition();

    const resolveDivisionId = async (f: MemberForm): Promise<string | null> => {
        if (f.division_id === "__new__" && f.new_division_name.trim()) {
            const div = await createDivision(f.new_division_name.trim());
            setDivisions((prev) =>
                [...prev, div].sort((a, b) => a.name.localeCompare(b.name)),
            );
            return div.id;
        }
        return f.division_id || null;
    };

    const buildPayload = (f: MemberForm, divisionId: string | null) => {
        const { new_division_name: _n, division_id: _d, ...rest } = f;
        return {
            ...rest,
            sort_order: Number(f.sort_order),
            division_id: divisionId,
        };
    };

    const handleCreate = () => {
        startTransition(async () => {
            try {
                const divisionId = await resolveDivisionId(form);
                const member = await createTeamMember(
                    buildPayload(form, divisionId),
                );
                setMembers((prev) => [...prev, member]);
                setForm(EMPTY_FORM);
                setShowForm(false);
                toast.success("Team member created");
            } catch {
                toast.error("Failed to create team member");
            }
        });
    };

    const handleUpdate = (id: string) => {
        startTransition(async () => {
            try {
                const divisionId = await resolveDivisionId(form);
                const member = await updateTeamMember(
                    id,
                    buildPayload(form, divisionId),
                );
                setMembers((prev) =>
                    prev.map((m) => (m.id === id ? member : m)),
                );
                setEditing(null);
                toast.success("Team member updated");
            } catch {
                toast.error("Failed to update team member");
            }
        });
    };

    const handleDelete = (id: string) => {
        if (!confirm("Delete this team member?")) return;
        startTransition(async () => {
            try {
                const member = members.find((m) => m.id === id);
                if (member?.picture_url) {
                    await deleteFile(member.picture_url);
                }
                await deleteTeamMember(id);
                setMembers((prev) => prev.filter((m) => m.id !== id));
                toast.success("Team member deleted");
            } catch {
                toast.error("Failed to delete team member");
            }
        });
    };

    const startEdit = (member: TeamMember & { division: Division | null }) => {
        setEditing(member.id);
        setForm({
            name: member.name,
            bio: member.bio,
            email: member.email ?? "",
            phone: member.phone ?? "",
            picture_url: member.picture_url ?? "",
            is_leader: member.is_leader,
            is_public: member.is_public,
            status: member.status,
            sort_order: member.sort_order,
            division_id: member.division_id ?? "",
            new_division_name: "",
        });
        setShowForm(false);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                    Team Members ({members.length})
                </h2>
                <Button
                    size="sm"
                    onClick={() => {
                        setShowForm(true);
                        setEditing(null);
                        setForm(EMPTY_FORM);
                    }}
                >
                    <Plus className="h-4 w-4 mr-1" /> Add Member
                </Button>
            </div>

            {/* Create form */}
            {showForm && (
                <MemberForm
                    form={form}
                    setForm={setForm}
                    onSubmit={handleCreate}
                    onCancel={() => setShowForm(false)}
                    isPending={isPending}
                    title="Add Team Member"
                    divisions={divisions}
                    originalUrl=""
                />
            )}

            <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Division</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Leader</TableHead>
                            <TableHead>Public</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead className="w-24">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {members.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="text-center text-muted-foreground py-8"
                                >
                                    No team members yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            members.map((member) => (
                                <>
                                    <TableRow key={member.id}>
                                        <TableCell className="font-medium">
                                            {member.name}
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-xs text-muted-foreground">
                                                {member.division?.name ?? "—"}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`text-xs font-medium ${member.status === "ACTIVE" ? "text-accent" : "text-muted-foreground"}`}
                                            >
                                                {member.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {member.is_leader ? (
                                                <Check className="h-4 w-4 text-primary" />
                                            ) : (
                                                "—"
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {member.is_public ? (
                                                <Check className="h-4 w-4 text-accent" />
                                            ) : (
                                                <X className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {member.sort_order}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() =>
                                                        startEdit(member)
                                                    }
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                                    onClick={() =>
                                                        handleDelete(member.id)
                                                    }
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {editing === member.id && (
                                        <TableRow key={`edit-${member.id}`}>
                                            <TableCell
                                                colSpan={7}
                                                className="p-0"
                                            >
                                                <div className="p-4 bg-muted/30 border-t border-border">
                                                    <MemberForm
                                                        form={form}
                                                        setForm={setForm}
                                                        onSubmit={() =>
                                                            handleUpdate(
                                                                member.id,
                                                            )
                                                        }
                                                        onCancel={() =>
                                                            setEditing(null)
                                                        }
                                                        isPending={isPending}
                                                        title="Edit Team Member"
                                                        divisions={divisions}
                                                        originalUrl={
                                                            member.picture_url ??
                                                            ""
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

function MemberForm({
    form,
    setForm,
    onSubmit,
    onCancel,
    isPending,
    title,
    divisions,
    originalUrl,
}: {
    form: MemberForm;
    setForm: React.Dispatch<React.SetStateAction<MemberForm>>;
    onSubmit: () => void;
    onCancel: () => void;
    isPending: boolean;
    title: string;
    divisions: Division[];
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
                    <Label>Name *</Label>
                    <Input
                        value={form.name}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, name: e.target.value }))
                        }
                        placeholder="Full name"
                    />
                </div>
                <div className="sm:col-span-2">
                    <Label>Bio *</Label>
                    <Textarea
                        value={form.bio}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, bio: e.target.value }))
                        }
                        rows={3}
                        placeholder="Short biography..."
                    />
                </div>
                <div>
                    <Label>Email</Label>
                    <Input
                        value={form.email}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, email: e.target.value }))
                        }
                        placeholder="email@example.com"
                        type="email"
                    />
                </div>
                <div>
                    <Label>Phone</Label>
                    <Input
                        value={form.phone}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, phone: e.target.value }))
                        }
                        placeholder="+880..."
                    />
                </div>
                <div className="sm:col-span-2">
                    <ImageUploadField
                        value={form.picture_url}
                        onChange={(url) =>
                            setForm((f) => ({ ...f, picture_url: url }))
                        }
                        folder="team"
                        label="Photo"
                        cleanupRef={cleanupRef}
                    />
                </div>
                <div>
                    <Label>Division</Label>
                    {form.division_id === "__new__" ? (
                        <div className="flex items-center gap-2">
                            <Input
                                className="flex-1"
                                value={form.new_division_name}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        new_division_name: e.target.value,
                                    }))
                                }
                                placeholder="New division name"
                                autoFocus
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 shrink-0"
                                onClick={() =>
                                    setForm((f) => ({
                                        ...f,
                                        division_id: "",
                                        new_division_name: "",
                                    }))
                                }
                                title="Cancel new division"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <select
                            className="w-full h-9 px-3 border border-input rounded-md bg-background text-sm"
                            value={form.division_id}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    division_id: e.target.value,
                                    new_division_name: "",
                                }))
                            }
                        >
                            <option value="">No division</option>
                            {divisions.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name}
                                </option>
                            ))}
                            <option value="__new__">+ Add new division…</option>
                        </select>
                    )}
                </div>
                <div>
                    <Label>Sort Order</Label>
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
                <div>
                    <Label>Status</Label>
                    <select
                        className="w-full h-9 px-3 border border-input rounded-md bg-background text-sm"
                        value={form.status}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                status: e.target.value as MemberStatus,
                            }))
                        }
                    >
                        <option value="ACTIVE">Active</option>
                        <option value="FORMER">Former</option>
                    </select>
                </div>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.is_leader}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    is_leader: e.target.checked,
                                }))
                            }
                        />
                        Project Lead
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.is_public}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    is_public: e.target.checked,
                                }))
                            }
                        />
                        Publicly visible
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
