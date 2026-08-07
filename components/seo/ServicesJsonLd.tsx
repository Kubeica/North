import type { Locale } from "@/lib/i18n/config";

type BreadcrumbJsonLdItem = {
  name: string;
  path: string;
};

type ServiceListItem = {
  name: string;
  description: string;
  slug: string;
  imageUrl?: string | null;
};

type ServicesJsonLdProps = {
  locale: Locale;
  title: string;
  description: string;
  imageUrl?: string | null;
  breadcrumb: BreadcrumbJsonLdItem[];
  services: ServiceListItem[];
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
 * CollectionPage + ItemList of Services + BreadcrumbList.
 * Organization is provided by the locale layout `JsonLd`.
 */
export function ServicesJsonLd({
  locale,
  title,
  description,
  imageUrl,
  breadcrumb,
  services,
}: ServicesJsonLdProps) {
  const base = siteUrl();
  const url = `${base}/${locale}/services`;
  const image = absoluteUrl(imageUrl);

  const collectionPage: Record<string, unknown> = {
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: title,
    description,
    isPartOf: { "@id": `${base}/#website` },
    about: { "@id": `${base}/#organization` },
    inLanguage: locale,
  };

  if (image) {
    collectionPage.primaryImageOfPage = {
      "@type": "ImageObject",
      url: image,
    };
  }

  const itemList = {
    "@type": "ItemList",
    "@id": `${url}#service-list`,
    itemListElement: services.map((service, index) => {
      const serviceUrl = `${base}/${locale}/services/${service.slug}`;
      const serviceNode: Record<string, unknown> = {
        "@type": "Service",
        "@id": `${serviceUrl}#service`,
        name: service.name,
        description: service.description,
        url: serviceUrl,
        provider: { "@id": `${base}/#organization` },
      };
      const serviceImage = absoluteUrl(service.imageUrl);
      if (serviceImage) serviceNode.image = serviceImage;

      return {
        "@type": "ListItem",
        position: index + 1,
        item: serviceNode,
      };
    }),
  };

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
    "@graph": [collectionPage, itemList, breadcrumbList],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(graph) }}
    />
  );
}
