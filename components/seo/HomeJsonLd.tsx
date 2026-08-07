import type { Locale } from "@/lib/i18n/config";

type HomeJsonLdProps = {
  locale: Locale;
  title: string;
  description: string;
  imageUrl?: string | null;
};

function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

function absoluteUrl(pathOrUrl?: string | null): string | undefined {
  if (!pathOrUrl) return undefined;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const base = siteUrl();
  return `${base}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Home WebPage structured data — links to Organization / WebSite graph. */
export function HomeJsonLd({
  locale,
  title,
  description,
  imageUrl,
}: HomeJsonLdProps) {
  const base = siteUrl();
  const url = `${base}/${locale}`;
  const image = absoluteUrl(imageUrl);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    isPartOf: { "@id": `${base}/#website` },
    about: { "@id": `${base}/#organization` },
    inLanguage: locale,
  };

  if (image) {
    data.primaryImageOfPage = {
      "@type": "ImageObject",
      url: image,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}
