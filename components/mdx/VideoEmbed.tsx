"use client";

/** Embed a video from Supabase Storage or a URL */
export function VideoEmbed({
    src,
    caption,
}: {
    src: string;
    caption?: string;
}) {
    return (
        <figure className="my-8">
            <div className="rounded-xl overflow-hidden bg-muted aspect-video">
                <video
                    src={src}
                    controls
                    className="w-full h-full object-contain"
                    preload="metadata"
                />
            </div>
            {caption && (
                <figcaption className="mt-2 text-center text-sm text-muted-foreground italic">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}
