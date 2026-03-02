"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ContentBlock } from "../types";

interface Props {
    block: Extract<ContentBlock, { type: "video" }>;
    onChange: (updated: Extract<ContentBlock, { type: "video" }>) => void;
}

export function VideoBlock({ block, onChange }: Props) {
    return (
        <div className="space-y-3">
            <div>
                <Label className="text-xs">Video URL *</Label>
                <Input
                    value={block.url}
                    onChange={(e) =>
                        onChange({ ...block, url: e.target.value })
                    }
                    placeholder="https://... (Supabase Storage, YouTube, or direct video link)"
                    className="text-sm"
                />
            </div>
            <div>
                <Label className="text-xs">Caption (optional)</Label>
                <Input
                    value={block.caption}
                    onChange={(e) =>
                        onChange({ ...block, caption: e.target.value })
                    }
                    placeholder="Video description"
                    className="text-sm"
                />
            </div>
        </div>
    );
}
