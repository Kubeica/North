import { clsx, type ClassValue } from "clsx";
import { format, type Locale as DateFnsLocale } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

import type { Locale } from "@/lib/i18n/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Convert a string into a URL-safe slug. */
export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

/** Format a byte count into a human-readable size string. */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB", "PB"] as const;
  const base = 1024;
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(base)),
    units.length - 1,
  );
  const value = bytes / base ** exponent;
  const precision = exponent === 0 ? 0 : decimals;

  return `${value.toFixed(precision)} ${units[exponent]}`;
}

const dateLocales: Record<Locale, DateFnsLocale> = {
  ar,
  en: enUS,
};

/** Format a date for display, locale-aware when a site locale is provided. */
export function formatDate(
  date: Date | string | number,
  pattern = "PPP",
  locale: Locale = "en",
): string {
  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) return "";
  return format(value, pattern, { locale: dateLocales[locale] });
}
