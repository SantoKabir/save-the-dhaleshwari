"use client";

import { GripVertical, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BlockType } from "./types";

const LABELS: Record<BlockType, string> = {
    text: "Text / Markdown",
    stat: "Stat Grid",
    chart: "Chart",
    image: "Image Gallery",
    video: "Video",
    table: "Data Table",
};

interface BlockShellProps {
    type: BlockType;
    onDelete: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    isDragging?: boolean;
    isOver?: boolean;
    children: React.ReactNode;
}

export function BlockShell({
    type,
    onDelete,
    onMoveUp,
    onMoveDown,
    isDragging,
    isOver,
    children,
}: BlockShellProps) {
    return (
        <div
            className={`group relative border rounded-xl bg-card transition-all select-none
                ${isDragging ? "opacity-40 ring-2 ring-primary/40" : "opacity-100"}
                ${isOver ? "ring-2 ring-primary ring-offset-1" : "border-border"}
            `}
        >
            {/* Header bar */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/30 rounded-t-xl cursor-grab active:cursor-grabbing">
                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex-1">
                    {LABELS[type]}
                </span>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={onMoveUp}
                        disabled={!onMoveUp}
                        title="Move up"
                    >
                        <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={onMoveDown}
                        disabled={!onMoveDown}
                        title="Move down"
                    >
                        <ChevronDown className="h-3 w-3" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        title="Delete block"
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            </div>
            <div className="p-4">{children}</div>
        </div>
    );
}
