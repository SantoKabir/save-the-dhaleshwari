"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface MediaItem {
    media_url: string;
    caption?: string | null;
    media_type: "IMAGE" | "VIDEO" | "CHART";
}

interface ImageGalleryProps {
    items: MediaItem[];
}

export function ImageGallery({ items }: ImageGalleryProps) {
    const images = items.filter((i) => i.media_type === "IMAGE");
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    if (images.length === 0) return null;

    const prev = () =>
        setLightboxIndex((i) =>
            i !== null ? (i - 1 + images.length) % images.length : null,
        );
    const next = () =>
        setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null));

    return (
        <>
            <div className="my-8 grid grid-cols-2 md:grid-cols-3 gap-3">
                {images.map((img, index) => (
                    <button
                        key={img.media_url}
                        onClick={() => setLightboxIndex(index)}
                        className="relative aspect-video rounded-xl overflow-hidden bg-muted group"
                        aria-label={`Open image ${index + 1}`}
                    >
                        <Image
                            src={img.media_url}
                            alt={img.caption ?? `Gallery image ${index + 1}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 50vw, 33vw"
                        />
                    </button>
                ))}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLightboxIndex(null)}
                    >
                        <motion.div
                            className="relative max-w-5xl w-full mx-4"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative aspect-video">
                                <Image
                                    src={images[lightboxIndex].media_url}
                                    alt={images[lightboxIndex].caption ?? ""}
                                    fill
                                    className="object-contain"
                                    sizes="100vw"
                                />
                            </div>
                            {images[lightboxIndex].caption && (
                                <p className="mt-3 text-center text-sm text-white/70">
                                    {images[lightboxIndex].caption}
                                </p>
                            )}
                        </motion.div>

                        <button
                            onClick={() => setLightboxIndex(null)}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        prev();
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                    aria-label="Previous"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        next();
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                    aria-label="Next"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
