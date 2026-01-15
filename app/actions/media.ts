"use server";

export type VideoData = {
    id: string;
    title: string;
    url: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

const videos = [
    { id: "village-walk", title: "A Walk Through Lonkarchar Village", filename: "A_walk_through_the_Lonkarchar_village.mp4" },
    { id: "river-walkway", title: "Walking Along the Dhaleshwari", filename: "A_walkway_on_the_bank_of_the_Dhaleshwari_river.mp4" },
    { id: "arrival", title: "Arrival at Lonkarchar", filename: "Arrival_at_Lonkarchar_village.mp4" },
    { id: "journey", title: "Journey to Lonkarchar", filename: "Journey_to_Lonkarchar_village.mp4" },
    { id: "rain", title: "Sudden Rain at Jamjam City", filename: "Sudden_rain_at_Jamjam_city.mp4" },
    { id: "wastewater-dump", title: "Wastewater Being Discharged", filename: "Wastewater_dumped_into_the_river.mp4" },
];

export async function getVideoUrls(): Promise<VideoData[]> {
    if (!SUPABASE_URL) {
        return [];
    }

    return videos.map((video) => ({
        id: video.id,
        title: video.title,
        url: `${SUPABASE_URL}/storage/v1/object/public/media/videos/${video.filename}`,
    }));
}

export async function getHeroVideoUrl(): Promise<string | null> {
    if (!SUPABASE_URL) {
        return null;
    }
    return `${SUPABASE_URL}/storage/v1/object/public/media/videos/Wastewater_dumped_into_the_river.mp4`;
}
