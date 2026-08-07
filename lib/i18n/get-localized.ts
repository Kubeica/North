import type { Locale } from "@/lib/i18n/config";

type LocalizedFieldKey = string;

type LocalizedSource = Record<string, unknown>;

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Pick a locale-specific field from an object with Ar/En suffixes.
 *
 * @example
 * localized({ titleAr: "عنوان", titleEn: "Title" }, "ar", "title") // "عنوان"
 */
export function localized<T extends LocalizedSource>(
  obj: T,
  locale: Locale,
  field: LocalizedFieldKey,
): string {
  const suffix = locale === "ar" ? "Ar" : "En";
  const fallbackSuffix = locale === "ar" ? "En" : "Ar";
  const primaryKey = `${field}${suffix}`;
  const fallbackKey = `${field}${fallbackSuffix}`;

  const primary = obj[primaryKey];
  if (typeof primary === "string" && primary.length > 0) {
    return primary;
  }

  const fallback = obj[fallbackKey];
  if (typeof fallback === "string") {
    return fallback;
  }

  // Support already-capitalized keys like TitleAr if callers pass "Title"
  const altPrimary = obj[`${capitalize(field)}${suffix}`];
  if (typeof altPrimary === "string" && altPrimary.length > 0) {
    return altPrimary;
  }

  return "";
}
