import type { ContentBlock } from "./types";

const PALETTE = [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444",
    "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16",
];

export function serializeBlocks(blocks: ContentBlock[]): string {
    return blocks
        .map((block) => {
            switch (block.type) {
                case "text":
                    return block.content;

                case "stat": {
                    const stats = block.stats
                        .filter((s) => s.label)
                        .map((s) => ({
                            label: s.label,
                            value: parseFloat(s.value) || 0,
                            ...(s.suffix ? { suffix: s.suffix } : {}),
                            ...(s.description
                                ? { description: s.description }
                                : {}),
                        }));
                    if (stats.length === 0) return "";
                    return `<StatCard stats={${JSON.stringify(stats)}} />`;
                }

                case "chart": {
                    const labels = block.labelsRaw
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                    const isPolar =
                        block.chartType === "pie" ||
                        block.chartType === "doughnut";
                    let datasets;
                    if (isPolar) {
                        const src = block.datasets[0];
                        datasets = [
                            {
                                label: src?.label || "",
                                data: (src?.dataRaw || "")
                                    .split(",")
                                    .map((s) => parseFloat(s.trim()) || 0),
                                backgroundColor: labels.map(
                                    (_, i) => PALETTE[i % PALETTE.length],
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
                    }
                    const titleProp = block.title
                        ? ` title={${JSON.stringify(block.title)}}`
                        : "";
                    return `<ChartEmbed type="${block.chartType}"${titleProp} labels={${JSON.stringify(labels)}} datasets={${JSON.stringify(datasets)}} />`;
                }

                case "image": {
                    const items = block.items.filter((i) => i.url);
                    if (items.length === 0) return "";
                    return `<ImageGallery items={${JSON.stringify(items)}} />`;
                }

                case "video":
                    if (!block.url) return "";
                    return `<VideoEmbed url={${JSON.stringify(block.url)}}${block.caption ? ` caption={${JSON.stringify(block.caption)}}` : ""} />`;

                case "table": {
                    const headers = block.headersRaw
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                    const rows = block.rowsRaw
                        .split("\n")
                        .map((row) => row.split(",").map((s) => s.trim()))
                        .filter((row) => row.some(Boolean));
                    if (headers.length === 0 && rows.length === 0) return "";
                    return `<DataTable headers={${JSON.stringify(headers)}} rows={${JSON.stringify(rows)}} />`;
                }
            }
        })
        .filter(Boolean)
        .join("\n\n");
}
