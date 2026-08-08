import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import { getLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { getCompanyProfile, getPublicSiteSeo } from "@/lib/data";
import { getDirection, type Locale } from "@/lib/i18n/config";
import {
  DEFAULT_APPLE_ICON_PATH,
  localizedSiteSeo,
  pickCmsOrFallback,
  resolveFaviconUrl,
} from "@/lib/seo/site-defaults";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const FALLBACK_TITLE = "Northern Meteor";
const FALLBACK_DESCRIPTION =
  "Northern Meteor for General Contracting & Trading — contracting, building, design, and integrated project solutions.";

export async function generateMetadata(): Promise<Metadata> {
  let locale: Locale = "ar";
  try {
    locale = (await getLocale()) as Locale;
  } catch {
    locale = "ar";
  }

  const [company, seoDefaults] = await Promise.all([
    getCompanyProfile(),
    getPublicSiteSeo(),
  ]);

  const localized = localizedSiteSeo(seoDefaults, locale);
  const siteName = company
    ? locale === "ar"
      ? company.nameAr || company.nameEn
      : company.nameEn || company.nameAr
    : FALLBACK_TITLE;
  const title = pickCmsOrFallback(localized.title, siteName || FALLBACK_TITLE);
  const description = pickCmsOrFallback(
    localized.description,
    FALLBACK_DESCRIPTION,
  );
  const favicon = resolveFaviconUrl(company?.faviconUrl);
  const apple =
    company?.logoUrl?.trim() || DEFAULT_APPLE_ICON_PATH;

  return {
    title: {
      default: title,
      template: `%s | ${siteName || FALLBACK_TITLE}`,
    },
    description,
    icons: {
      icon: favicon,
      apple,
    },
    metadataBase: process.env.NEXT_PUBLIC_SITE_URL
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
      : undefined,
  };
}

type RootLayoutProps = {
  children: ReactNode;
};

/**
 * Root layout sets document lang/dir on the server for SEO + first paint RTL.
 */
export default async function RootLayout({ children }: RootLayoutProps) {
  let locale: Locale = "ar";
  try {
    locale = (await getLocale()) as Locale;
  } catch {
    locale = "ar";
  }
  const dir = getDirection(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${inter.variable} ${ibmPlexArabic.variable} h-full`}
    >
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
