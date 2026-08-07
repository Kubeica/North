import { mediaMaxBytes } from "@/lib/security/env-limits";

/** SVG intentionally excluded — same-origin SVG can execute script. */
export const MEDIA_ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

/** Map trusted MIME → extension (never trust client filename alone). */
export const MEDIA_MIME_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "application/pdf": "pdf",
};

export function mediaMaxBytesLimit(): number {
  return mediaMaxBytes();
}

export function isAllowedMediaMime(mimeType: string): boolean {
  return MEDIA_ALLOWED_MIME.has(mimeType);
}

export function isAllowedMediaSize(size: number): boolean {
  return size > 0 && size <= mediaMaxBytes();
}

export function extensionForMediaMime(mimeType: string): string | null {
  return MEDIA_MIME_EXTENSION[mimeType] ?? null;
}
