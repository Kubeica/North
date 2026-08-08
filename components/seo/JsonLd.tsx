import type { Locale } from "@/lib/i18n/config";
import { localized } from "@/lib/i18n/get-localized";

type CompanyLike = {
  nameAr: string;
  nameEn: string;
  shortDescriptionAr: string;
  shortDescriptionEn: string;
  email?: string | null;
  phone?: string | null;
  addressAr?: string | null;
  addressEn?: string | null;
  logoUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  linkedinUrl?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
};

type JsonLdProps = {
  company: CompanyLike | null;
  locale: Locale;
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
 * Organization + WebSite JSON-LD for the public locale layout.
 * Does not invent certifications, awards, or unverified claims.
 */
export function JsonLd({ company, locale }: JsonLdProps) {
  const base = siteUrl();
  const name = company
    ? localized(company, locale, "name") || "Northern Meteor"
    : "Northern Meteor";
  const description = company
    ? localized(company, locale, "shortDescription")
    : undefined;
  const address = company
    ? localized(company, locale, "address") || undefined
    : undefined;
  const logo = absoluteUrl(company?.logoUrl);

  const sameAs = company
    ? [
        company.linkedinUrl,
        company.facebookUrl,
        company.instagramUrl,
        company.youtubeUrl,
      ].filter((url): url is string => Boolean(url))
    : [];

  const organization: Record<string, unknown> = {
    "@type": "Organization",
    "@id": `${base}/#organization`,
    name,
    url: base,
  };

  if (description) organization.description = description;
  if (logo) {
    organization.logo = logo;
    organization.image = logo;
  }
  if (company?.email) organization.email = company.email;
  if (company?.phone) organization.telephone = company.phone;
  if (address) {
    organization.address = {
      "@type": "PostalAddress",
      streetAddress: address,
    };
  }
  if (
    company?.latitude != null &&
    company?.longitude != null &&
    Number.isFinite(company.latitude) &&
    Number.isFinite(company.longitude)
  ) {
    organization.geo = {
      "@type": "GeoCoordinates",
      latitude: company.latitude,
      longitude: company.longitude,
    };
  }
  if (sameAs.length > 0) organization.sameAs = sameAs;

  const website: Record<string, unknown> = {
    "@type": "WebSite",
    "@id": `${base}/#website`,
    url: base,
    name,
    inLanguage: ["ar", "en"],
    publisher: { "@id": `${base}/#organization` },
  };

  if (description) website.description = description;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [organization, website],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(graph) }}
    />
  );
}
