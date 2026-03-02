"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import type { ContentBlock, StatItem } from "../types";

interface Props {
    block: Extract<ContentBlock, { type: "stat" }>;
    onChange: (updated: Extract<ContentBlock, { type: "stat" }>) => void;
}

const EMPTY_STAT: StatItem = {
    label: "",
    value: "0",
    suffix: "",
    description: "",
};

export function StatBlock({ block, onChange }: Props) {
    const update = (index: number, partial: Partial<StatItem>) => {
        const stats = block.stats.map((s, i) =>
            i === index ? { ...s, ...partial } : s,
        );
        onChange({ ...block, stats });
    };

    const remove = (index: number) => {
        onChange({
            ...block,
            stats: block.stats.filter((_, i) => i !== index),
        });
    };

    const add = () => {
        onChange({ ...block, stats: [...block.stats, { ...EMPTY_STAT }] });
    };

    return (
        <div className="space-y-3">
            {block.stats.map((stat, i) => (
                <div
                    key={i}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-muted/20 rounded-lg"
                >
                    <div>
                        <Label className="text-xs">Label *</Label>
                        <Input
                            value={stat.label}
                            onChange={(e) =>
                                update(i, { label: e.target.value })
                            }
                            placeholder="e.g. Households Surveyed"
                            className="h-8 text-sm"
                        />
                    </div>
                    <div>
                        <Label className="text-xs">Value *</Label>
                        <Input
                            value={stat.value}
                            onChange={(e) =>
                                update(i, { value: e.target.value })
                            }
                            placeholder="53"
                            className="h-8 text-sm"
                        />
                    </div>
                    <div>
                        <Label className="text-xs">Suffix</Label>
                        <Input
                            value={stat.suffix}
                            onChange={(e) =>
                                update(i, { suffix: e.target.value })
                            }
                            placeholder="% or + or x"
                            className="h-8 text-sm"
                        />
                    </div>
                    <div className="flex gap-2 items-end">
                        <div className="flex-1">
                            <Label className="text-xs">Description</Label>
                            <Input
                                value={stat.description}
                                onChange={(e) =>
                                    update(i, { description: e.target.value })
                                }
                                placeholder="Short note"
                                className="h-8 text-sm"
                            />
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                            onClick={() => remove(i)}
                            disabled={block.stats.length === 1}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={add}
            >
                <Plus className="h-3 w-3" /> Add Stat
            </Button>
        </div>
    );
}
