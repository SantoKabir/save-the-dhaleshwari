export type ChartType = "bar" | "line" | "pie" | "doughnut";

export interface StatItem {
    label: string;
    value: string; // stored as string in editor; parsed to number on serialize
    suffix: string;
    description: string;
}

export interface DatasetRow {
    label: string;
    dataRaw: string; // comma-separated numbers
    color: string;
}

export interface ImageItem {
    url: string;
    caption: string;
}

export type ContentBlock =
    | { id: string; type: "text"; content: string }
    | { id: string; type: "stat"; stats: StatItem[] }
    | {
        id: string;
        type: "chart";
        chartType: ChartType;
        title: string;
        labelsRaw: string;
        datasets: DatasetRow[];
    }
    | { id: string; type: "image"; items: ImageItem[] }
    | { id: string; type: "video"; url: string; caption: string }
    | { id: string; type: "table"; headersRaw: string; rowsRaw: string };

export type BlockType = ContentBlock["type"];
