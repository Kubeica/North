import type { Metadata } from "next";

import { defaultLocale, locales, type Locale } from "@/lib/i18n/config";

export type BuildPageMetadataInput = {
  title: string;
  description?: string;
  locale?: Locale;
  path?: string;
  imageUrl?: string | null;
  noIndex?: boolean;
  siteName?: string;
};

function siteBase(): string | undefined {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || undefined;
}

function absoluteUrl(pathOrUrl?: string | null): string | undefined {
  if (!pathOrUrl) return undefined;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const base = siteBase();
  if (!base) return pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

/** Strip leading locale segment so alternates can be rebuilt per language. */
function pathWithoutLocale(path?: string): string {
  if (!path) return "";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const match = normalized.match(/^\/(ar|en)(\/.*)?$/);
  if (!match) return normalized === "/" ? "" : normalized;
  return match[2] ?? "";
}

/** Build Next.js Metadata for public pages with Open Graph + Twitter defaults. */
export function buildPageMetadata(input: BuildPageMetadataInput): Metadata {
  const siteName = input.siteName ?? "Northern Meteor";
  const locale = input.locale ?? defaultLocale;
  const suffix = pathWithoutLocale(input.path);
  const canonicalPath = `/${locale}${suffix}`;
  const url = absoluteUrl(canonicalPath);
  const description = input.description?.trim() || undefined;
  const imageAbsolute = absoluteUrl(input.imageUrl);
  const images = imageAbsolute
    ? [
        {
          url: imageAbsolute,
          alt: input.title,
          width: 1200,
          height: 630,
        },
      ]
    : undefined;

  const languages: Record<string, string> = {};
  for (const loc of locales) {
    const href = absoluteUrl(`/${loc}${suffix}`);
    if (href) languages[loc] = href;
  }
  const xDefault = absoluteUrl(`/${defaultLocale}${suffix}`);
  if (xDefault) languages["x-default"] = xDefault;

  const base = siteBase();

  return {
    metadataBase: base ? new URL(base) : undefined,
    title: input.title,
    description,
    alternates: url
      ? {
          canonical: url,
          languages: Object.keys(languages).length > 0 ? languages : undefined,
        }
      : undefined,
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: input.title,
      description,
      url,
      siteName,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      alternateLocale: locale === "ar" ? ["en_US"] : ["ar_SA"],
      type: "website",
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: input.title,
      description,
      images: images?.map((image) => image.url),
    },
  };
}
