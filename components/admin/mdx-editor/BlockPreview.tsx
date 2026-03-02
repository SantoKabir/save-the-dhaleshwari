"use client";

import Image from "next/image";
import katex from "katex";
import { StatCard } from "@/components/mdx/StatCard";
import { DataTable } from "@/components/mdx/StatCard";
import { ChartEmbed } from "@/components/mdx/ChartEmbed";
import { VideoEmbed } from "@/components/mdx/VideoEmbed";
import type { ContentBlock } from "./types";

// ── Math helpers ─────────────────────────────────────────────────────────────
function renderDisplayMath(math: string): string {
    try {
        return `<div style="overflow-x:auto">${katex.renderToString(
            math.trim(),
            {
                throwOnError: false,
                displayMode: true,
            },
        )}</div>`;
    } catch {
        return `<pre>$$${math}$$</pre>`;
    }
}

// ── Minimal markdown → HTML (covers the patterns admins actually use) ────────
function applyInline(raw: string): string {
    // Extract inline math $...$ first so KaTeX HTML isn't re-escaped
    const mathSpans: string[] = [];
    let text = raw.replace(/\$([^$\n]+)\$/g, (_, math) => {
        const idx = mathSpans.length;
        try {
            mathSpans.push(
                katex.renderToString(math, {
                    throwOnError: false,
                    displayMode: false,
                }),
            );
        } catch {
            mathSpans.push(`$${math}$`);
        }
        return `\x00MATH${idx}\x00`;
    });
    // HTML-escape the non-math remainder, then apply inline markup
    text = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/(?<![*_])[*_]([^*_]+)[*_](?![*_])/g, "<em>$1</em>")
        .replace(/`([^`]+)`/g, "<code>$1</code>");
    // Restore math spans as raw HTML
    return text.replace(
        /\x00MATH(\d+)\x00/g,
        (_, idx) => mathSpans[parseInt(idx)],
    );
}

function markdownToHtml(md: string): string {
    const lines = md.split("\n");
    const out: string[] = [];
    let inUl = false;
    let inOl = false;
    let olCounter = 0;
    let inMath = false;
    const mathLines: string[] = [];

    const closeList = () => {
        if (inUl) {
            out.push("</ul>");
            inUl = false;
        }
        if (inOl) {
            out.push("</ol>");
            inOl = false;
            olCounter = 0;
        }
    };

    for (const line of lines) {
        const t = line.trim();

        // Display math block: $$ delimiter on its own line
        if (t === "$$") {
            if (!inMath) {
                closeList();
                inMath = true;
                mathLines.length = 0;
            } else {
                inMath = false;
                out.push(renderDisplayMath(mathLines.join("\n")));
            }
            continue;
        }
        // Single-line display math: $$...$$
        const singleMath = t.match(/^\$\$(.+)\$\$$/);
        if (singleMath) {
            closeList();
            out.push(renderDisplayMath(singleMath[1]));
            continue;
        }
        if (inMath) {
            mathLines.push(line);
            continue;
        }

        if (t.startsWith("#### ")) {
            closeList();
            out.push(`<h4>${applyInline(t.slice(5))}</h4>`);
        } else if (t.startsWith("### ")) {
            closeList();
            out.push(`<h3>${applyInline(t.slice(4))}</h3>`);
        } else if (t.startsWith("## ")) {
            closeList();
            out.push(`<h2>${applyInline(t.slice(3))}</h2>`);
        } else if (t.startsWith("# ")) {
            closeList();
            out.push(`<h1>${applyInline(t.slice(2))}</h1>`);
        } else if (/^\d+\.\s/.test(t)) {
            if (inUl) {
                out.push("</ul>");
                inUl = false;
            }
            if (!inOl) {
                out.push("<ol>");
                inOl = true;
                olCounter = 0;
            }
            olCounter++;
            out.push(`<li>${applyInline(t.replace(/^\d+\.\s/, ""))}</li>`);
        } else if (t.startsWith("- ") || t.startsWith("* ")) {
            if (inOl) {
                out.push("</ol>");
                inOl = false;
            }
            if (!inUl) {
                out.push("<ul>");
                inUl = true;
            }
            out.push(`<li>${applyInline(t.slice(2))}</li>`);
        } else if (t.startsWith("> ")) {
            closeList();
            out.push(`<blockquote>${applyInline(t.slice(2))}</blockquote>`);
        } else if (t === "" || t === "---") {
            closeList();
            out.push(t === "---" ? "<hr/>" : "<br/>");
        } else {
            closeList();
            out.push(`<p>${applyInline(t)}</p>`);
        }
    }
    // Flush unclosed math block
    if (inMath) out.push(renderDisplayMath(mathLines.join("\n")));
    closeList();
    return out.join("\n");
}

// ── Individual block renderers ───────────────────────────────────────────────

function PreviewText({ content }: { content: string }) {
    if (!content.trim())
        return (
            <p className="text-muted-foreground italic text-sm">
                (empty text block)
            </p>
        );
    return (
        <div
            className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-serif prose-a:text-primary prose-img:rounded-xl break-words"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
        />
    );
}

function PreviewStat({
    block,
}: {
    block: Extract<ContentBlock, { type: "stat" }>;
}) {
    const stats = block.stats
        .filter((s) => s.label)
        .map((s) => ({
            label: s.label,
            value: parseFloat(s.value) || 0,
            ...(s.suffix ? { suffix: s.suffix } : {}),
            ...(s.description ? { description: s.description } : {}),
        }));
    if (stats.length === 0)
        return (
            <p className="text-muted-foreground italic text-sm">
                (no stats defined)
            </p>
        );
    // StatCard props extend StatItem so top-level value/label are required by TS
    return <StatCard value={0} label="" stats={stats} />;
}

const PREVIEW_PALETTE = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
];

function PreviewChart({
    block,
}: {
    block: Extract<ContentBlock, { type: "chart" }>;
}) {
    const labels = block.labelsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    const isPolar = block.chartType === "pie" || block.chartType === "doughnut";

    if (!labels.length)
        return (
            <p className="text-muted-foreground italic text-sm">
                (no chart data)
            </p>
        );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let datasets: any[];
    if (isPolar) {
        const src = block.datasets[0];
        datasets = [
            {
                label: src?.label || "",
                data: (src?.dataRaw || "")
                    .split(",")
                    .map((s) => parseFloat(s.trim()) || 0),
                backgroundColor: labels.map(
                    (_, i) => PREVIEW_PALETTE[i % PREVIEW_PALETTE.length],
                ),
                borderColor: "#ffffff",
            },
        ];
    } else {
        datasets = block.datasets
            .filter((d) => d.label)
            .map((d) => ({
                label: d.label,
                data: d.dataRaw
                    .split(",")
                    .map((s) => parseFloat(s.trim()) || 0),
                backgroundColor: d.color,
                borderColor: d.color,
            }));
        if (!datasets.length)
            return (
                <p className="text-muted-foreground italic text-sm">
                    (no chart data)
                </p>
            );
    }

    return (
        <ChartEmbed
            type={block.chartType}
            title={block.title || undefined}
            labels={labels}
            datasets={datasets}
        />
    );
}

function PreviewImage({
    block,
}: {
    block: Extract<ContentBlock, { type: "image" }>;
}) {
    const items = block.items.filter((i) => i.url);
    if (items.length === 0)
        return (
            <p className="text-muted-foreground italic text-sm">
                (no images uploaded yet)
            </p>
        );
    return (
        <div className="my-4 grid grid-cols-2 md:grid-cols-3 gap-3">
            {items.map((item, idx) => (
                <figure key={idx} className="space-y-1">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                        <Image
                            src={item.url}
                            alt={item.caption || `Image ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 33vw"
                        />
                    </div>
                    {item.caption && (
                        <figcaption className="text-xs text-muted-foreground text-center">
                            {item.caption}
                        </figcaption>
                    )}
                </figure>
            ))}
        </div>
    );
}

function PreviewVideo({
    block,
}: {
    block: Extract<ContentBlock, { type: "video" }>;
}) {
    if (!block.url)
        return (
            <p className="text-muted-foreground italic text-sm">
                (no video URL)
            </p>
        );
    return <VideoEmbed src={block.url} caption={block.caption || undefined} />;
}

function PreviewTable({
    block,
}: {
    block: Extract<ContentBlock, { type: "table" }>;
}) {
    const headers = block.headersRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    const rows = block.rowsRaw
        .split("\n")
        .map((row) => row.split(",").map((s) => s.trim()))
        .filter((row) => row.some(Boolean));
    if (headers.length === 0 && rows.length === 0)
        return (
            <p className="text-muted-foreground italic text-sm">
                (no table data)
            </p>
        );
    return (
        <div className="overflow-x-auto">
            <DataTable headers={headers} rows={rows} />
        </div>
    );
}

// ── Main export ──────────────────────────────────────────────────────────────

export function BlockPreview({ blocks }: { blocks: ContentBlock[] }) {
    if (blocks.length === 0) {
        return (
            <div className="flex items-center justify-center border-2 border-dashed border-border rounded-lg py-10 text-muted-foreground text-sm">
                No content yet.
            </div>
        );
    }

    return (
        <div className="w-full overflow-hidden rounded-xl border border-border bg-background p-6 space-y-6">
            {blocks.map((block) => (
                <div key={block.id}>
                    {block.type === "text" && (
                        <PreviewText content={block.content} />
                    )}
                    {block.type === "stat" && <PreviewStat block={block} />}
                    {block.type === "chart" && <PreviewChart block={block} />}
                    {block.type === "image" && <PreviewImage block={block} />}
                    {block.type === "video" && <PreviewVideo block={block} />}
                    {block.type === "table" && <PreviewTable block={block} />}
                </div>
            ))}
        </div>
    );
}
