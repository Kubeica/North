import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import { getLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { getDirection, type Locale } from "@/lib/i18n/config";

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
  weight: ["400", "500", "600"],
  variable: "--font-arabic",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: {
    default: "Northern Meteor Construction",
    template: "%s | Northern Meteor",
  },
  description:
    "Northern Meteor Construction — We Build Today What Will Stand Tomorrow.",
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
};

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
