import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function imageUrl(imageName: string): string {
    return `${SUPABASE_URL}/storage/v1/object/public/media/images/${imageName}`;
}
