"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { UploadCloud, X, RefreshCw } from "lucide-react";
import imageCompression from "browser-image-compression";
import { uploadFile, deleteFile } from "@/app/actions/storage";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type StorageFolder = "images" | "team";

interface ImageUploadFieldProps {
    value: string;
    onChange: (url: string) => void;
    folder?: StorageFolder;
    label?: string;
    cleanupRef: React.MutableRefObject<string | null>;
}

export function ImageUploadField({
    value,
    onChange,
    folder = "images",
    label = "Image",
    cleanupRef,
}: ImageUploadFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFile = async (file: File) => {
        const toastId = `upload-${Date.now()}`;
        setIsLoading(true);
        toast.loading("Compressing image…", { id: toastId });
        try {
            const compressed = await imageCompression(file, {
                maxSizeMB: 0.8,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                fileType: "image/webp",
                initialQuality: 0.82,
            });

            toast.loading("Uploading…", { id: toastId });

            // Delete previously session-uploaded file before uploading new one
            if (cleanupRef.current) {
                await deleteFile(cleanupRef.current);
                cleanupRef.current = null;
            }

            const formData = new FormData();
            formData.append(
                "file",
                compressed,
                compressed.name || "image.webp",
            );
            const { url, error } = await uploadFile(formData, folder);
            if (error || !url) {
                toast.error(error ?? "Upload failed", { id: toastId });
                return;
            }
            cleanupRef.current = url;
            onChange(url);
            toast.success("Image uploaded", { id: toastId });
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Upload failed", {
                id: toastId,
            });
        } finally {
            setIsLoading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    const handleRemove = async () => {
        if (cleanupRef.current) {
            await deleteFile(cleanupRef.current);
            cleanupRef.current = null;
        }
        onChange("");
    };

    return (
        <div>
            {label && <Label className="mb-1.5 block">{label}</Label>}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                }}
            />
            {value ? (
                <div className="relative inline-flex items-center gap-3 p-2 border border-border rounded-lg bg-muted/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={value}
                        alt="Preview"
                        className="h-20 w-20 rounded object-cover shrink-0"
                    />
                    <div className="flex flex-col gap-1.5">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs gap-1"
                            disabled={isLoading}
                            onClick={() => inputRef.current?.click()}
                        >
                            <RefreshCw className="h-3 w-3" /> Replace
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs gap-1 text-destructive hover:text-destructive"
                            disabled={isLoading}
                            onClick={handleRemove}
                        >
                            <X className="h-3 w-3" /> Remove
                        </Button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => inputRef.current?.click()}
                    className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-border rounded-lg
                               bg-muted/20 hover:bg-muted/40 hover:border-primary/40 transition-colors
                               text-muted-foreground cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <RefreshCw className="h-5 w-5 animate-spin mb-1.5" />
                    ) : (
                        <UploadCloud className="h-5 w-5 mb-1.5" />
                    )}
                    <span className="text-xs font-medium">
                        {isLoading ? "Processing…" : "Click to upload"}
                    </span>
                    <span className="text-[10px] mt-0.5 opacity-60">
                        Any image — compressed to WebP automatically
                    </span>
                </button>
            )}
        </div>
    );
}
