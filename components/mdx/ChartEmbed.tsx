"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    type ChartData,
    type ChartOptions,
} from "chart.js";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
);

type ChartType = "bar" | "line" | "pie" | "doughnut";

interface ChartEmbedProps {
    type: ChartType;
    title?: string;
    caption?: string;
    height?: number;
    options?: ChartOptions<ChartType>;
    // Flat MDX-friendly props
    labels?: string[];
    datasets?: ChartData<ChartType>["datasets"];
    // Or a pre-built data object
    data?: ChartData<ChartType>;
}

export function ChartEmbed({
    type,
    title,
    data,
    labels,
    datasets,
    options,
    caption,
    height = 320,
}: ChartEmbedProps) {
    // Support both flat (labels + datasets) and pre-built (data) prop styles
    const chartData: ChartData<ChartType> = data ?? {
        labels: labels ?? [],
        datasets: datasets ?? [],
    };

    const defaultOptions: ChartOptions<ChartType> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "bottom" as const },
            ...(title ? { title: { display: true, text: title } } : {}),
        },
        ...options,
    };

    const ChartComponent = {
        bar: Bar,
        line: Line,
        pie: Pie,
        doughnut: Doughnut,
    }[type] as React.ComponentType<{
        data: ChartData<ChartType>;
        options: ChartOptions<ChartType>;
    }>;

    return (
        <figure className="my-8">
            <div
                className="rounded-xl bg-card border border-border p-4"
                style={{ height }}
            >
                <ChartComponent data={chartData} options={defaultOptions} />
            </div>
            {caption && (
                <figcaption className="mt-2 text-center text-sm text-muted-foreground italic">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}
