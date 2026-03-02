"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import type { ContentBlock, ChartType, DatasetRow } from "../types";

interface Props {
    block: Extract<ContentBlock, { type: "chart" }>;
    onChange: (updated: Extract<ContentBlock, { type: "chart" }>) => void;
}

const CHART_TYPES: { value: ChartType; label: string }[] = [
    { value: "bar", label: "Bar" },
    { value: "line", label: "Line" },
    { value: "pie", label: "Pie" },
    { value: "doughnut", label: "Doughnut" },
];

const PALETTE = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
];

export function ChartBlock({ block, onChange }: Props) {
    const updateDataset = (index: number, partial: Partial<DatasetRow>) => {
        const datasets = block.datasets.map((d, i) =>
            i === index ? { ...d, ...partial } : d,
        );
        onChange({ ...block, datasets });
    };

    const removeDataset = (index: number) => {
        onChange({
            ...block,
            datasets: block.datasets.filter((_, i) => i !== index),
        });
    };

    const addDataset = () => {
        const color = PALETTE[block.datasets.length % PALETTE.length];
        onChange({
            ...block,
            datasets: [...block.datasets, { label: "", dataRaw: "", color }],
        });
    };

    const isPolar = block.chartType === "pie" || block.chartType === "doughnut";

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <Label className="text-xs">Chart Type</Label>
                    <select
                        className="w-full h-8 px-2 border border-input rounded-md bg-background text-sm"
                        value={block.chartType}
                        onChange={(e) =>
                            onChange({
                                ...block,
                                chartType: e.target.value as ChartType,
                            })
                        }
                    >
                        {CHART_TYPES.map(({ value, label }) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                    {isPolar && (
                        <p className="text-xs text-muted-foreground mt-1">
                            Only the first dataset is used. Multi-series data is
                            preserved if you switch back to bar/line.
                        </p>
                    )}
                </div>
                <div>
                    <Label className="text-xs">Title (optional)</Label>
                    <Input
                        value={block.title}
                        onChange={(e) =>
                            onChange({ ...block, title: e.target.value })
                        }
                        placeholder="Chart title"
                        className="h-8 text-sm"
                    />
                </div>
            </div>

            <div>
                <Label className="text-xs">
                    {isPolar ? "Slice labels" : "X-axis labels"}{" "}
                    <span className="text-muted-foreground font-normal">
                        (comma-separated)
                    </span>
                </Label>
                <Input
                    value={block.labelsRaw}
                    onChange={(e) =>
                        onChange({ ...block, labelsRaw: e.target.value })
                    }
                    placeholder={
                        isPolar
                            ? "Red meat, Vegetables, Grains"
                            : "January, February, March"
                    }
                    className="h-8 text-sm"
                />
            </div>

            <div className="space-y-2">
                <Label className="text-xs">
                    {isPolar ? "Values" : "Datasets"}
                </Label>

                {/* Polar charts: only show one dataset row, no colour picker */}
                {isPolar ? (
                    <div className="grid grid-cols-[1fr_auto] gap-2 items-end p-2 bg-muted/20 rounded-lg">
                        <div>
                            <Label className="text-xs text-muted-foreground">
                                Values{" "}
                                <span className="font-normal">
                                    (CSV, one per slice)
                                </span>
                            </Label>
                            <Input
                                value={block.datasets[0]?.dataRaw ?? ""}
                                onChange={(e) =>
                                    updateDataset(0, {
                                        dataRaw: e.target.value,
                                    })
                                }
                                placeholder="45, 62, 38"
                                className="h-8 text-sm"
                            />
                        </div>
                        <div className="text-xs text-muted-foreground pt-5">
                            Auto-coloured
                        </div>
                    </div>
                ) : (
                    /* Non-polar charts: all dataset rows + add button */
                    <>
                        {block.datasets.map((ds, i) => (
                            <div
                                key={i}
                                className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-end p-2 bg-muted/20 rounded-lg"
                            >
                                <div>
                                    <Label className="text-xs text-muted-foreground">
                                        Series name
                                    </Label>
                                    <Input
                                        value={ds.label}
                                        onChange={(e) =>
                                            updateDataset(i, {
                                                label: e.target.value,
                                            })
                                        }
                                        placeholder="e.g. Households"
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">
                                        Values{" "}
                                        <span className="font-normal">
                                            (CSV)
                                        </span>
                                    </Label>
                                    <Input
                                        value={ds.dataRaw}
                                        onChange={(e) =>
                                            updateDataset(i, {
                                                dataRaw: e.target.value,
                                            })
                                        }
                                        placeholder="45, 62, 38"
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">
                                        Colour
                                    </Label>
                                    <input
                                        type="color"
                                        value={ds.color}
                                        onChange={(e) =>
                                            updateDataset(i, {
                                                color: e.target.value,
                                            })
                                        }
                                        className="h-8 w-10 rounded border border-input cursor-pointer bg-background p-0.5"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                    onClick={() => removeDataset(i)}
                                    disabled={block.datasets.length === 1}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs gap-1"
                            onClick={addDataset}
                        >
                            <Plus className="h-3 w-3" /> Add Dataset
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
