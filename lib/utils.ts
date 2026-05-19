import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import slugify from "slugify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Generate a URL-safe slug from any string */
export function toSlug(text: string): string {
  return slugify(text, { lower: true, strict: true, trim: true });
}

/** Format a date to a readable string */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

/** Truncate a string to a maximum length */
export function truncate(text: string, length = 100): string {
  return text.length > length ? text.slice(0, length) + "…" : text;
}

/** Format file size in bytes to a human-readable string */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Check if a MIME type is an image */
export function isImage(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}
