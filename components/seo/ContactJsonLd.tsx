import type { Locale } from "@/lib/i18n/config";

type BreadcrumbJsonLdItem = {
  name: string;
  path: string;
};

type ContactJsonLdProps = {
  locale: Locale;
  title: string;
  description: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
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
 * ContactPage + BreadcrumbList JSON-LD.
 * Organization is provided by the locale layout `JsonLd`.
 */
export function ContactJsonLd({
  locale,
  title,
  description,
  phone,
  email,
  address,
  latitude,
  longitude,
  breadcrumb,
}: ContactJsonLdProps) {
  const base = siteUrl();
  const url = `${base}/${locale}/contact`;

  const contactPage: Record<string, unknown> = {
    "@type": "ContactPage",
    "@id": `${url}#contactpage`,
    url,
    name: title,
    description,
    isPartOf: { "@id": `${base}/#website` },
    about: { "@id": `${base}/#organization` },
    inLanguage: locale,
  };

  const mainEntity: Record<string, unknown> = {
    "@type": "Organization",
    "@id": `${base}/#organization`,
  };

  if (phone) mainEntity.telephone = phone;
  if (email) mainEntity.email = email;
  if (address) {
    mainEntity.address = {
      "@type": "PostalAddress",
      streetAddress: address,
    };
  }
  if (
    latitude != null &&
    longitude != null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude)
  ) {
    mainEntity.geo = {
      "@type": "GeoCoordinates",
      latitude,
      longitude,
    };
  }

  contactPage.mainEntity = mainEntity;

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
    "@graph": [contactPage, breadcrumbList],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(graph) }}
    />
  );
}
