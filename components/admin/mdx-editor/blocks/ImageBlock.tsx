"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import type { ContentBlock, ImageItem } from "../types";

interface Props {
    block: Extract<ContentBlock, { type: "image" }>;
    onChange: (updated: Extract<ContentBlock, { type: "image" }>) => void;
}

/**
 * Each image slot is its own component so it can hold a stable cleanupRef
 * (necessary because ImageUploadField needs a stable ref per upload slot).
 */
function ImageSlot({
    item,
    onUpdate,
    onRemove,
    canRemove,
}: {
    item: ImageItem;
    onUpdate: (partial: Partial<ImageItem>) => void;
    onRemove: () => void;
    canRemove: boolean;
}) {
    const cleanupRef = useRef<string | null>(null);

    return (
        <div className="p-3 bg-muted/20 rounded-lg space-y-2">
            <ImageUploadField
                value={item.url}
                onChange={(url) => onUpdate({ url })}
                folder="images"
                label="Image"
                cleanupRef={cleanupRef}
            />
            <div>
                <Label className="text-xs">Caption (optional)</Label>
                <Input
                    value={item.caption}
                    onChange={(e) => onUpdate({ caption: e.target.value })}
                    placeholder="Describe this image..."
                    className="h-8 text-sm"
                />
            </div>
            {canRemove && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1 text-destructive hover:text-destructive"
                    onClick={onRemove}
                >
                    <Trash2 className="h-3 w-3" /> Remove image
                </Button>
            )}
        </div>
    );
}

export function ImageBlock({ block, onChange }: Props) {
    const updateItem = (index: number, partial: Partial<ImageItem>) => {
        const items = block.items.map((item, i) =>
            i === index ? { ...item, ...partial } : item,
        );
        onChange({ ...block, items });
    };

    const removeItem = (index: number) => {
        onChange({
            ...block,
            items: block.items.filter((_, i) => i !== index),
        });
    };

    const addItem = () => {
        onChange({
            ...block,
            items: [...block.items, { url: "", caption: "" }],
        });
    };

    return (
        <div className="space-y-3">
            {block.items.map((item, i) => (
                <ImageSlot
                    key={i}
                    item={item}
                    onUpdate={(partial) => updateItem(i, partial)}
                    onRemove={() => removeItem(i)}
                    canRemove={block.items.length > 1}
                />
            ))}
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={addItem}
            >
                <Plus className="h-3 w-3" /> Add Image
            </Button>
        </div>
    );
}
