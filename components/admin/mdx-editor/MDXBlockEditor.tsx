"use client";

import { useEffect, useRef, useState } from "react";
import {
    AlignLeft,
    BarChart2,
    ChevronDown,
    Image as ImageIcon,
    Plus,
    Table2,
    Video,
    Hash,
    Code2,
    Eye,
    Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BlockShell } from "./BlockShell";
import { TextBlock } from "./blocks/TextBlock";
import { StatBlock } from "./blocks/StatBlock";
import { ChartBlock } from "./blocks/ChartBlock";
import { ImageBlock } from "./blocks/ImageBlock";
import { VideoBlock } from "./blocks/VideoBlock";
import { TableBlock } from "./blocks/TableBlock";
import { BlockPreview } from "./BlockPreview";
import { deserializeBlocks } from "./deserialize";
import { serializeBlocks } from "./serialize";
import type { BlockType, ContentBlock } from "./types";

interface Props {
    value: string;
    onChange: (mdx: string) => void;
    label?: string;
}

interface AddOption {
    type: BlockType;
    label: string;
    icon: React.ReactNode;
}

const ADD_OPTIONS: AddOption[] = [
    {
        type: "text",
        label: "Text / Markdown",
        icon: <AlignLeft className="h-3.5 w-3.5" />,
    },
    {
        type: "stat",
        label: "Stat Grid",
        icon: <Hash className="h-3.5 w-3.5" />,
    },
    {
        type: "chart",
        label: "Chart",
        icon: <BarChart2 className="h-3.5 w-3.5" />,
    },
    {
        type: "image",
        label: "Image Gallery",
        icon: <ImageIcon className="h-3.5 w-3.5" />,
    },
    { type: "video", label: "Video", icon: <Video className="h-3.5 w-3.5" /> },
    {
        type: "table",
        label: "Data Table",
        icon: <Table2 className="h-3.5 w-3.5" />,
    },
];

function createBlock(type: BlockType): ContentBlock {
    const id = crypto.randomUUID();
    switch (type) {
        case "text":
            return { id, type: "text", content: "" };
        case "stat":
            return {
                id,
                type: "stat",
                stats: [{ label: "", value: "0", suffix: "", description: "" }],
            };
        case "chart":
            return {
                id,
                type: "chart",
                chartType: "bar",
                title: "",
                labelsRaw: "",
                datasets: [{ label: "", dataRaw: "", color: "#3b82f6" }],
            };
        case "image":
            return { id, type: "image", items: [{ url: "", caption: "" }] };
        case "video":
            return { id, type: "video", url: "", caption: "" };
        case "table":
            return { id, type: "table", headersRaw: "", rowsRaw: "" };
    }
}

export function MDXBlockEditor({ value, onChange, label = "Content" }: Props) {
    const [blocks, setBlocksRaw] = useState<ContentBlock[]>(() =>
        deserializeBlocks(value),
    );
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [viewMode, setViewMode] = useState<"edit" | "preview" | "source">(
        "edit",
    );
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [overIndex, setOverIndex] = useState<number | null>(null);
    const lastEmitted = useRef(value);

    useEffect(() => {
        if (value !== lastEmitted.current) {
            lastEmitted.current = value;
            setBlocksRaw(deserializeBlocks(value));
        }
    }, [value]);

    function setBlocks(next: ContentBlock[]) {
        setBlocksRaw(next);
        const mdx = serializeBlocks(next);
        lastEmitted.current = mdx;
        onChange(mdx);
    }

    function updateBlock(id: string, updated: ContentBlock) {
        setBlocks(blocks.map((b) => (b.id === id ? updated : b)));
    }

    function deleteBlock(id: string) {
        setBlocks(blocks.filter((b) => b.id !== id));
    }

    function moveBlock(fromIndex: number, toIndex: number) {
        if (fromIndex === toIndex) return;
        const next = [...blocks];
        const [removed] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, removed);
        setBlocks(next);
    }

    function addBlock(type: BlockType) {
        setBlocks([...blocks, createBlock(type)]);
        setShowAddMenu(false);
    }

    // ── HTML5 Drag-and-Drop ─────────────────────────────────────────────────
    function handleDragStart(id: string) {
        setDraggingId(id);
    }

    function handleDragOver(e: React.DragEvent, index: number) {
        e.preventDefault();
        setOverIndex(index);
    }

    function handleDrop(e: React.DragEvent, toIndex: number) {
        e.preventDefault();
        if (draggingId == null) return;
        const fromIndex = blocks.findIndex((b) => b.id === draggingId);
        moveBlock(fromIndex, toIndex);
        setDraggingId(null);
        setOverIndex(null);
    }

    function handleDragEnd() {
        setDraggingId(null);
        setOverIndex(null);
    }

    return (
        <div className="space-y-2">
            {/* Header row */}
            <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">{label}</Label>
                <div className="flex items-center gap-0.5 rounded-md border border-border bg-muted/40 p-0.5">
                    <Button
                        type="button"
                        variant={viewMode === "edit" ? "secondary" : "ghost"}
                        size="sm"
                        className="h-6 px-2 text-xs gap-1"
                        onClick={() => setViewMode("edit")}
                    >
                        <Pencil className="h-3 w-3" /> Edit
                    </Button>
                    <Button
                        type="button"
                        variant={viewMode === "preview" ? "secondary" : "ghost"}
                        size="sm"
                        className="h-6 px-2 text-xs gap-1"
                        onClick={() => setViewMode("preview")}
                    >
                        <Eye className="h-3 w-3" /> Preview
                    </Button>
                    <Button
                        type="button"
                        variant={viewMode === "source" ? "secondary" : "ghost"}
                        size="sm"
                        className="h-6 px-2 text-xs gap-1"
                        onClick={() => setViewMode("source")}
                    >
                        <Code2 className="h-3 w-3" /> MDX
                    </Button>
                </div>
            </div>

            {/* Rendered preview */}
            {viewMode === "preview" && <BlockPreview blocks={blocks} />}

            {/* Raw MDX source */}
            {viewMode === "source" && (
                <pre className="p-3 bg-muted/30 rounded-md text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all border border-border max-h-96">
                    {serializeBlocks(blocks) || "(empty)"}
                </pre>
            )}

            {/* Block list — only visible in edit mode */}
            {viewMode === "edit" && (
                <div className="space-y-3">
                    {blocks.length === 0 && (
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg py-10 text-muted-foreground text-sm gap-2">
                            <p>No blocks yet.</p>
                            <p className="text-xs">
                                Click&nbsp;<strong>Add Block</strong>&nbsp;below
                                to get started.
                            </p>
                        </div>
                    )}

                    {blocks.map((block, index) => {
                        const isDragging = draggingId === block.id;
                        const isOver = overIndex === index && !isDragging;

                        return (
                            <div
                                key={block.id}
                                draggable
                                onDragStart={() => handleDragStart(block.id)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDrop={(e) => handleDrop(e, index)}
                                onDragEnd={handleDragEnd}
                            >
                                <BlockShell
                                    type={block.type}
                                    onDelete={() => deleteBlock(block.id)}
                                    onMoveUp={
                                        index > 0
                                            ? () => moveBlock(index, index - 1)
                                            : undefined
                                    }
                                    onMoveDown={
                                        index < blocks.length - 1
                                            ? () => moveBlock(index, index + 1)
                                            : undefined
                                    }
                                    isDragging={isDragging}
                                    isOver={isOver}
                                >
                                    {block.type === "text" && (
                                        <TextBlock
                                            block={block}
                                            onChange={(u) =>
                                                updateBlock(block.id, u)
                                            }
                                        />
                                    )}
                                    {block.type === "stat" && (
                                        <StatBlock
                                            block={block}
                                            onChange={(u) =>
                                                updateBlock(block.id, u)
                                            }
                                        />
                                    )}
                                    {block.type === "chart" && (
                                        <ChartBlock
                                            block={block}
                                            onChange={(u) =>
                                                updateBlock(block.id, u)
                                            }
                                        />
                                    )}
                                    {block.type === "image" && (
                                        <ImageBlock
                                            block={block}
                                            onChange={(u) =>
                                                updateBlock(block.id, u)
                                            }
                                        />
                                    )}
                                    {block.type === "video" && (
                                        <VideoBlock
                                            block={block}
                                            onChange={(u) =>
                                                updateBlock(block.id, u)
                                            }
                                        />
                                    )}
                                    {block.type === "table" && (
                                        <TableBlock
                                            block={block}
                                            onChange={(u) =>
                                                updateBlock(block.id, u)
                                            }
                                        />
                                    )}
                                </BlockShell>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add block — only in edit mode */}
            {viewMode === "edit" && (
                <div className="relative">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs h-8"
                        onClick={() => setShowAddMenu((v) => !v)}
                    >
                        <Plus className="h-3.5 w-3.5" /> Add Block{" "}
                        <ChevronDown className="h-3 w-3 opacity-60" />
                    </Button>

                    {showAddMenu && (
                        <div className="absolute z-50 mt-1 w-52 rounded-md border border-border bg-background shadow-md py-1">
                            {ADD_OPTIONS.map(
                                ({ type, label: optLabel, icon }) => (
                                    <button
                                        key={type}
                                        type="button"
                                        className="flex w-full items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent"
                                        onClick={() => addBlock(type)}
                                    >
                                        {icon}
                                        {optLabel}
                                    </button>
                                ),
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
