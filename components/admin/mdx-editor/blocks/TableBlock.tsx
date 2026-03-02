"use client";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ContentBlock } from "../types";

interface Props {
    block: Extract<ContentBlock, { type: "table" }>;
    onChange: (updated: Extract<ContentBlock, { type: "table" }>) => void;
}

export function TableBlock({ block, onChange }: Props) {
    return (
        <div className="space-y-3">
            <div>
                <Label className="text-xs">
                    Column Headers{" "}
                    <span className="text-muted-foreground font-normal">
                        (comma-separated)
                    </span>
                </Label>
                <Input
                    value={block.headersRaw}
                    onChange={(e) =>
                        onChange({ ...block, headersRaw: e.target.value })
                    }
                    placeholder="Location, pH Level, Heavy Metals (mg/L)"
                    className="h-8 text-sm"
                />
            </div>
            <div>
                <Label className="text-xs">
                    Rows{" "}
                    <span className="text-muted-foreground font-normal">
                        (one row per line, values comma-separated)
                    </span>
                </Label>
                <Textarea
                    value={block.rowsRaw}
                    onChange={(e) =>
                        onChange({ ...block, rowsRaw: e.target.value })
                    }
                    rows={5}
                    className="font-mono text-sm"
                    placeholder={
                        "Upstream, 7.2, 0.03\nMidstream, 6.8, 0.12\nDownstream, 6.1, 0.48"
                    }
                />
            </div>
        </div>
    );
}
