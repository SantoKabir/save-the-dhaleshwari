"use client";

import { Textarea } from "@/components/ui/textarea";
import type { ContentBlock } from "../types";

interface Props {
    block: Extract<ContentBlock, { type: "text" }>;
    onChange: (updated: Extract<ContentBlock, { type: "text" }>) => void;
}

export function TextBlock({ block, onChange }: Props) {
    return (
        <Textarea
            value={block.content}
            onChange={(e) => onChange({ ...block, content: e.target.value })}
            rows={6}
            className="font-mono text-sm resize-y"
            placeholder="Write Markdown here. Supports **bold**, *italic*, # headings, - lists, > blockquotes, | tables, etc."
        />
    );
}
