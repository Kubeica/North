/**
 * DTO-safe date helpers.
 * Values from `unstable_cache` / Flight may already be ISO strings.
 */

export type DateInput = Date | string | number | null | undefined;

/** Convert Date | string to ISO string; nullish stays null. */
export function toIsoString(value: DateInput): string | null {
  if (value == null || value === "") return null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? trimmed : parsed.toISOString();
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString();
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

/** Like toIsoString but never null (empty string when invalid). */
export function toIsoStringRequired(value: DateInput, fallback = ""): string {
  return toIsoString(value) ?? fallback;
}
