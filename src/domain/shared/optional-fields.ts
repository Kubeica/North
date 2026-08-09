import { z } from "zod";

/**
 * Optional form strings: empty input clears the DB field (null), not "leave unchanged".
 * Use on full-form admin updates that always submit every field.
 */
export function optionalString(max: number) {
  return z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : null));
}

/** True for safe local CMS asset paths: /uploads/... or /images/... */
export function isSafeLocalAssetPath(value: string): boolean {
  if (!value.startsWith("/") || value.startsWith("//")) return false;
  if (value.includes("\\") || value.includes("\0")) return false;

  let decoded: string;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return false;
  }

  if (decoded.includes("\\") || decoded.includes("\0")) return false;
  if (decoded.split("/").includes("..")) return false;
  if (!decoded.startsWith("/uploads/") && !decoded.startsWith("/images/")) {
    return false;
  }

  return true;
}

export function isSafeHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/** Absolute http(s) only — social links, client websites. Empty → null. */
export function optionalHttpUrl() {
  return z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || isSafeHttpUrl(value), {
      message: "Invalid URL",
    })
    .transform((value) => (value ? value : null));
}

/**
 * CMS media URLs: local /uploads|/images paths (MediaPicker) or absolute http(s).
 * Rejects protocol-relative (//…), path traversal, and non-http(s) schemes.
 * Empty → null.
 */
export function optionalMediaUrl() {
  return z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) =>
        !value || isSafeLocalAssetPath(value) || isSafeHttpUrl(value),
      { message: "Invalid URL" },
    )
    .transform((value) => (value ? value : null));
}

/** @deprecated Prefer optionalMediaUrl or optionalHttpUrl — kept as media alias. */
export function optionalUrl() {
  return optionalMediaUrl();
}

/** Non-empty media URL for galleries (same rules as optionalMediaUrl). */
export const mediaUrlSchema = z
  .string()
  .trim()
  .min(1, "URL is required")
  .refine(
    (value) => isSafeLocalAssetPath(value) || isSafeHttpUrl(value),
    { message: "Invalid URL" },
  );

/** Optional cuid relation id; empty clears/disconnects (null). */
export function optionalCuid() {
  return z
    .string()
    .cuid()
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : null));
}

export function optionalEmail() {
  return z
    .string()
    .trim()
    .email("Invalid email address")
    .max(254)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : null));
}
