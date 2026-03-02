import type {
    ContentBlock,
    StatItem,
    DatasetRow,
    ImageItem,
    ChartType,
} from "./types";

function mkId() {
    return Math.random().toString(36).slice(2, 10);
}

/** Safely evaluate a JS expression (JS object / array literal from a JSX prop). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function evalExpr(str: string): any {
    // new Function runs in browser context (MDXBlockEditor is "use client")
    // eslint-disable-next-line no-new-func
    return new Function("return (" + str + ")")();
}

/** Extract a JSX prop value — handles both prop="value" and prop={...} */
function extractProp(propName: string, source: string): string | null {
    // prop="value"
    const quotedMatch = source.match(new RegExp(`${propName}="([^"]*)"`));
    if (quotedMatch) return quotedMatch[1];

    // prop={...} — find balanced braces
    const marker = `${propName}={`;
    const braceStart = source.indexOf(marker);
    if (braceStart === -1) return null;

    const start = braceStart + marker.length;
    let depth = 1;
    let i = start;
    while (i < source.length && depth > 0) {
        if (source[i] === "{") depth++;
        else if (source[i] === "}") depth--;
        i++;
    }
    return source.slice(start, i - 1);
}

/**
 * Safely extract a plain string prop, handling both:
 *   prop="simple value"  → returns the string as-is
 *   prop={"escaped \"value\""}  → evaluates the JS expression and returns the string
 */
function extractStringProp(propName: string, source: string): string {
    const raw = extractProp(propName, source);
    if (raw === null) return "";
    // If the raw value looks like a JS string literal (starts with quote), evaluate it
    if (raw.startsWith('"') || raw.startsWith("'") || raw.startsWith("`")) {
        try {
            return String(evalExpr(raw));
        } catch {
            /* fall through */
        }
    }
    return raw;
}

export function deserializeBlocks(mdx: string): ContentBlock[] {
    if (!mdx.trim()) return [];

    const componentPattern =
        /<(StatCard|ChartEmbed|ImageGallery|VideoEmbed|DataTable)\s[\s\S]*?\/>/g;

    const blocks: ContentBlock[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = componentPattern.exec(mdx)) !== null) {
        const textBefore = mdx.slice(lastIndex, match.index).trim();
        if (textBefore) {
            blocks.push({ id: mkId(), type: "text", content: textBefore });
        }

        const tag = match[1];
        const full = match[0];

        try {
            if (tag === "StatCard") {
                const statsStr = extractProp("stats", full);
                let stats: StatItem[] = [
                    { label: "", value: "0", suffix: "", description: "" },
                ];
                if (statsStr) {
                    try {
                        const parsed = evalExpr(statsStr);
                        const arr = Array.isArray(parsed) ? parsed : [parsed];
                        stats = arr.map(
                            (s: {
                                label?: string;
                                value?: number;
                                suffix?: string;
                                description?: string;
                            }) => ({
                                label: s.label ?? "",
                                value: String(s.value ?? 0),
                                suffix: s.suffix ?? "",
                                description: s.description ?? "",
                            }),
                        );
                    } catch {
                        /* keep default */
                    }
                }
                blocks.push({ id: mkId(), type: "stat", stats });
            } else if (tag === "ChartEmbed") {
                const chartType =
                    (extractProp("type", full) ?? "bar") as ChartType;
                const title = extractStringProp("title", full);
                const labelsStr = extractProp("labels", full);
                const datasetsStr = extractProp("datasets", full);
                let labelsRaw = "";
                let datasets: DatasetRow[] = [
                    { label: "Dataset 1", dataRaw: "", color: "#3b82f6" },
                ];
                if (labelsStr) {
                    try {
                        const p = evalExpr(labelsStr);
                        labelsRaw = Array.isArray(p) ? p.join(", ") : "";
                    } catch {
                        /* keep default */
                    }
                }
                if (datasetsStr) {
                    try {
                        const p = evalExpr(datasetsStr);
                        datasets = (Array.isArray(p) ? p : []).map(
                            (d: {
                                label?: string;
                                data?: number[];
                                backgroundColor?: string;
                                borderColor?: string;
                            }) => ({
                                label: d.label ?? "",
                                dataRaw: Array.isArray(d.data)
                                    ? d.data.join(", ")
                                    : "",
                                color:
                                    d.backgroundColor ??
                                    d.borderColor ??
                                    "#3b82f6",
                            }),
                        );
                    } catch {
                        /* keep default */
                    }
                }
                blocks.push({
                    id: mkId(),
                    type: "chart",
                    chartType,
                    title,
                    labelsRaw,
                    datasets,
                });
            } else if (tag === "ImageGallery") {
                const itemsStr = extractProp("items", full);
                let items: ImageItem[] = [];
                if (itemsStr) {
                    try {
                        const p = evalExpr(itemsStr);
                        items = Array.isArray(p)
                            ? p.map(
                                (i: { url?: string; caption?: string }) => ({
                                    url: i.url ?? "",
                                    caption: i.caption ?? "",
                                }),
                            )
                            : [];
                    } catch {
                        /* keep default */
                    }
                }
                blocks.push({ id: mkId(), type: "image", items });
            } else if (tag === "VideoEmbed") {
                const url = extractStringProp("url", full);
                const caption = extractStringProp("caption", full);
                blocks.push({ id: mkId(), type: "video", url, caption });
            } else if (tag === "DataTable") {
                const headersStr = extractProp("headers", full);
                const rowsStr = extractProp("rows", full);
                let headersRaw = "";
                let rowsRaw = "";
                if (headersStr) {
                    try {
                        const p = evalExpr(headersStr);
                        headersRaw = Array.isArray(p) ? p.join(", ") : "";
                    } catch {
                        /* keep default */
                    }
                }
                if (rowsStr) {
                    try {
                        const p = evalExpr(rowsStr);
                        rowsRaw = Array.isArray(p)
                            ? p
                                .map((row: string[]) => row.join(", "))
                                .join("\n")
                            : "";
                    } catch {
                        /* keep default */
                    }
                }
                blocks.push({
                    id: mkId(),
                    type: "table",
                    headersRaw,
                    rowsRaw,
                });
            }
        } catch {
            blocks.push({ id: mkId(), type: "text", content: full });
        }

        lastIndex = match.index + full.length;
    }

    const remaining = mdx.slice(lastIndex).trim();
    if (remaining) {
        blocks.push({ id: mkId(), type: "text", content: remaining });
    }

    return blocks;
}
