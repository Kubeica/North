import type { Locale } from "@/lib/i18n/config";

type BreadcrumbJsonLdItem = {
  name: string;
  path: string;
};

type AboutJsonLdProps = {
  locale: Locale;
  title: string;
  description: string;
  imageUrl?: string | null;
  breadcrumb: BreadcrumbJsonLdItem[];
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

/**
 * AboutPage + BreadcrumbList JSON-LD.
 * Organization is provided by the locale layout `JsonLd`.
 */
export function AboutJsonLd({
  locale,
  title,
  description,
  imageUrl,
  breadcrumb,
}: AboutJsonLdProps) {
  const base = siteUrl();
  const url = `${base}/${locale}/about`;
  const image = absoluteUrl(imageUrl);

  const aboutPage: Record<string, unknown> = {
    "@type": "AboutPage",
    "@id": `${url}#aboutpage`,
    url,
    name: title,
    description,
    isPartOf: { "@id": `${base}/#website` },
    about: { "@id": `${base}/#organization` },
    inLanguage: locale,
  };

  if (image) {
    aboutPage.primaryImageOfPage = {
      "@type": "ImageObject",
      url: image,
    };
  }

  const breadcrumbList = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: breadcrumb.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [aboutPage, breadcrumbList],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(graph) }}
    />
  );
}
