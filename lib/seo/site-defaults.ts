import type { Locale } from "@/lib/i18n/config";
import { SITE_SETTING_KEYS } from "@/lib/settings/keys";
import { settingsService } from "@/src/domain/settings/service";

export const DEFAULT_FAVICON_PATH = "/images/favicon-northern-meteor.png";
export const DEFAULT_APPLE_ICON_PATH = "/images/logo-northern-meteor.png";

export type SiteSeoDefaults = {
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
};

/** Prefer a non-empty CMS value; otherwise keep the localized fallback. */
export function pickCmsOrFallback(
  cmsValue: string | null | undefined,
  fallback: string,
): string {
  const value = cmsValue?.trim();
  return value ? value : fallback;
}

/** Public favicon from CompanyProfile, with local asset fallback. */
export function resolveFaviconUrl(
  faviconUrl: string | null | undefined,
): string {
  return pickCmsOrFallback(faviconUrl, DEFAULT_FAVICON_PATH);
}

export function localizedSiteSeo(
  defaults: SiteSeoDefaults,
  locale: Locale,
): { title: string; description: string } {
  if (locale === "ar") {
    return {
      title: defaults.titleAr,
      description: defaults.descriptionAr,
    };
  }
  return {
    title: defaults.titleEn,
    description: defaults.descriptionEn,
  };
}

export async function getSiteSeoDefaults(): Promise<SiteSeoDefaults> {
  const rows = await settingsService.getSettings([
    SITE_SETTING_KEYS.seoTitleEn,
    SITE_SETTING_KEYS.seoTitleAr,
    SITE_SETTING_KEYS.seoDescriptionEn,
    SITE_SETTING_KEYS.seoDescriptionAr,
  ]);
  const map = Object.fromEntries(rows.map((row) => [row.key, row.value]));

  return {
    titleEn: map[SITE_SETTING_KEYS.seoTitleEn] ?? "",
    titleAr: map[SITE_SETTING_KEYS.seoTitleAr] ?? "",
    descriptionEn: map[SITE_SETTING_KEYS.seoDescriptionEn] ?? "",
    descriptionAr: map[SITE_SETTING_KEYS.seoDescriptionAr] ?? "",
  };
}
