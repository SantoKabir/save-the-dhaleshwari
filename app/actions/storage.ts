"use server";

import { createAdminClient } from "@/lib/supabase/admin";

type StorageFolder = "images" | "videos" | "team";

export async function uploadFile(
    formData: FormData,
    folder: StorageFolder = "images"
): Promise<{ url: string | null; error: string | null }> {
    const file = formData.get("file") as File | null;
    if (!file) return { url: null, error: "No file provided" };

    const supabase = createAdminClient();
    const ext = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
        .from("media")
        .upload(fileName, file, { contentType: file.type, upsert: false });

    if (error) return { url: null, error: error.message };

    const { data } = supabase.storage.from("media").getPublicUrl(fileName);
    return { url: data.publicUrl, error: null };
}

export async function deleteFile(url: string): Promise<{ error: string | null }> {
    const supabase = createAdminClient();
    // Extract path from public URL
    const parts = url.split("/storage/v1/object/public/media/");
    if (parts.length < 2) return { error: "Invalid URL" };
    const path = parts[1];

    const { error } = await supabase.storage.from("media").remove([path]);
    return { error: error?.message ?? null };
}
