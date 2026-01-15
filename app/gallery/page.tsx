"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getVideoUrls, type VideoData } from "@/app/actions/media";
import { imageUrl } from "@/lib/utils";

// size: "large" = spans 2 cols, "tall" = spans 2 rows, "wide" = spans 2 cols 1 row, "normal" = 1x1
const images = [
    { src: "People_bathing_in_the_river_in_Lonkarchar_village.jpg", alt: "People bathing in the river", category: "Community", size: "large" },
    { src: "From_left__Hazrat,_Shopon,_Monir,_Tara.jpg", alt: "Village focus group discussion", category: "Community", size: "wide" },
    { src: "Abu_Taher_tending_to_his_nets.jpg", alt: "Abu Taher with his fishing nets", category: "Community", size: "tall" },
    { src: "Samsur,_working_on_his_boat.jpg", alt: "Samsur preparing his boat", category: "Community", size: "normal" },
    { src: "Open_ditch__drain_polluted_with_chemicals.jpg", alt: "Chemical-polluted drainage", category: "Pollution", size: "normal" },
    { src: "Sludge_lagoon.jpg", alt: "Tannery sludge lagoon", category: "Pollution", size: "large" },
    { src: "Waste_water_dump_into_the_Dhaleshwari.jpg", alt: "Wastewater discharge", category: "Pollution", size: "wide" },
    { src: "Water_Polluted_with_chemicals.jpg", alt: "Polluted river water", category: "Pollution", size: "tall" },
    { src: "Sludge_from_the_lagoon_leaking_into_the_river.jpg", alt: "Sludge leaking into river", category: "Pollution", size: "normal" },
    { src: "Leather_drying_and_solid_waste_piles_at_the_bank_of_the_river.jpg", alt: "Solid waste on riverbank", category: "Industry", size: "wide" },
    { src: "Leather_drying.jpg", alt: "Leather drying process", category: "Industry", size: "normal" },
    { src: "Orange_leather_drying_on_the_field.jpg", alt: "Orange leather in fields", category: "Industry", size: "large" },
    { src: "CETP.jpg", alt: "Common Effluent Treatment Plant", category: "Industry", size: "normal" },
    { src: "Vehicles_carrying_sludge.jpg", alt: "Sludge transport vehicles", category: "Industry", size: "tall" },
    { src: "A_school_in_Lonkarchar_village.jpg", alt: "Village school", category: "Village", size: "normal" },
    { src: "Agricultural_land_in_Lonkarchar_village.jpg", alt: "Agricultural fields", category: "Village", size: "wide" },
    { src: "Village_road_of_Lonkarchor_village.jpg", alt: "Village road", category: "Village", size: "normal" },
    { src: "Fisherman_s_boat.jpg", alt: "Fisherman's boat on river", category: "Community", size: "normal" },
    { src: "The_boat_I_used_to_cross_the_river.jpg", alt: "River crossing boat", category: "Journey", size: "large" },
    { src: "Me_in_front_of_the_gate_no._1.jpg", alt: "Researcher at tannery gate", category: "Journey", size: "tall" },
];

const categories = ["All", "Community", "Pollution", "Industry", "Village", "Journey"];

export default function GalleryPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [filter, setFilter] = useState("All");
    const [videos, setVideos] = useState<VideoData[]>([]);
    const [loadingVideos, setLoadingVideos] = useState(true);

    useEffect(() => {
        async function loadVideos() {
            try {
                const videoData = await getVideoUrls();
                setVideos(videoData);
            } catch (error) {
                console.error("Failed to load videos:", error);
            } finally {
                setLoadingVideos(false);
            }
        }
        loadVideos();
    }, []);

    // Close lightbox on ESC key
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape" && selectedImage) {
                setSelectedImage(null);
            }
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [selectedImage]);

    const filteredImages = filter === "All"
        ? images
        : images.filter((img) => img.category === filter);

    return (
        <>
            <Header />
            <main className="min-h-screen pt-16">
                <div className="container max-w-7xl mx-auto px-4 py-20">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                            Gallery
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            A visual journey through the Dhaleshwari River, affected
                            communities, and the source of pollution.
                        </p>
                    </div>

                    {/* Filter */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setFilter(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === category
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Image Grid - Mosaic Layout */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[200px]">
                        {filteredImages.map((image, index) => {
                            // Determine grid span classes based on size
                            const sizeClasses = {
                                large: "col-span-2 row-span-2",
                                tall: "col-span-1 row-span-2",
                                wide: "col-span-2 row-span-1",
                                normal: "col-span-1 row-span-1",
                            };
                            const spanClass = sizeClasses[image.size as keyof typeof sizeClasses] || "col-span-1 row-span-1";

                            return (
                                <motion.div
                                    key={image.src}
                                    className={`relative rounded-xl overflow-hidden cursor-pointer group ${spanClass}`}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.03 }}
                                    onClick={() => setSelectedImage(image.src)}
                                >
                                    <Image
                                        src={imageUrl(image.src)}
                                        alt={image.alt}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                                        <p className="p-4 text-white text-sm font-medium">{image.alt}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Videos Section */}
                    <section className="mb-10 mt-8">
                        <h2 className="text-2xl font-semibold mb-8">Videos</h2>
                        {loadingVideos ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <span className="ml-3 text-muted-foreground">Loading videos...</span>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-6">
                                {videos.filter(v => v.url).map((video) => (
                                    <div
                                        key={video.id}
                                        className="bg-card border border-border rounded-xl overflow-hidden"
                                    >
                                        <video
                                            controls
                                            className="w-full aspect-video"
                                            poster="/images/People_bathing_in_the_river_in_Lonkarchar_village.jpg"
                                        >
                                            <source src={video.url!} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                        <div className="p-4">
                                            <h3 className="font-medium">{video.title}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* Lightbox */}
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedImage(null)}
                        >
                            <button
                                className="absolute top-4 right-4 text-white hover:text-accent transition-colors"
                                onClick={() => setSelectedImage(null)}
                            >
                                <X className="h-8 w-8" />
                            </button>
                            <motion.div
                                className="relative max-w-5xl max-h-[90vh] w-full h-full"
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.9 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Image
                                    src={imageUrl(selectedImage)}
                                    alt="Gallery image"
                                    fill
                                    className="object-contain"
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            <Footer />
        </>
    );
}
