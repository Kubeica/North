import type { Locale } from "@/lib/i18n/config";

type BreadcrumbJsonLdItem = {
  name: string;
  path: string;
};

type ProjectDetailJsonLdProps = {
  locale: Locale;
  title: string;
  description: string;
  slug: string;
  imageUrl?: string | null;
  datePublished?: string | null;
  dateCompleted?: string | null;
  location?: string | null;
  clientName?: string | null;
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
 * Project CreativeWork + BreadcrumbList JSON-LD.
 * Organization is provided by the locale layout `JsonLd`.
 */
export function ProjectDetailJsonLd({
  locale,
  title,
  description,
  slug,
  imageUrl,
  datePublished,
  dateCompleted,
  location,
  clientName,
  breadcrumb,
}: ProjectDetailJsonLdProps) {
  const base = siteUrl();
  const url = `${base}/${locale}/projects/${slug}`;
  const image = absoluteUrl(imageUrl);

  const projectNode: Record<string, unknown> = {
    "@type": "CreativeWork",
    "@id": `${url}#project`,
    url,
    name: title,
    description,
    inLanguage: locale,
    creator: { "@id": `${base}/#organization` },
    isPartOf: { "@id": `${base}/${locale}/projects#collection` },
  };

  if (image) projectNode.image = image;
  if (datePublished) projectNode.datePublished = datePublished;
  if (dateCompleted) projectNode.dateCreated = dateCompleted;
  if (location) {
    projectNode.contentLocation = {
      "@type": "Place",
      name: location,
    };
  }
  if (clientName) {
    projectNode.contributor = {
      "@type": "Organization",
      name: clientName,
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
    "@graph": [projectNode, breadcrumbList],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(graph) }}
    />
  );
}
