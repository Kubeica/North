import { getTranslations, setRequestLocale } from "next-intl/server";

import { AboutCapabilities } from "@/components/public/AboutCapabilities";
import { AboutSafetyQuality } from "@/components/public/AboutSafetyQuality";
import { PageHero } from "@/components/public/PageHero";
import { ServicesEquipment } from "@/components/public/ServicesEquipment";
import { ServicesFaq } from "@/components/public/ServicesFaq";
import { ServicesFeatured } from "@/components/public/ServicesFeatured";
import { ServicesIntro } from "@/components/public/ServicesIntro";
import { ServicesMethodology } from "@/components/public/ServicesMethodology";
import { ServicesJsonLd } from "@/components/seo/ServicesJsonLd";
import { getCompanyProfile, getPublicSiteSeo, getServices } from "@/lib/data";
import {
  localizedSiteSeo,
  pickCmsOrFallback,
} from "@/lib/seo/site-defaults";
import type { Locale } from "@/lib/i18n/config";
import { localized } from "@/lib/i18n/get-localized";
import { resolveHeroImageUrl } from "@/lib/media/public-assets";
import { buildPageMetadata } from "@/lib/seo/metadata";

/** ISR — CMS content can lag up to 60s. */
export const revalidate = 60;

type ServicesPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ServicesPageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const [t, company, seoDefaults] = await Promise.all([
    getTranslations({ locale, namespace: "services" }),
    getCompanyProfile(),
    getPublicSiteSeo(),
  ]);
  const siteName = company
    ? localized(company, locale, "name")
    : "Northern Meteor";
  const cms = localizedSiteSeo(seoDefaults, locale);

  return buildPageMetadata({
    title: t("title"),
    description:
      t("seoDescription") ||
      pickCmsOrFallback(cms.description, t("subtitle")),
    locale,
    path: `/${locale}/services`,
    imageUrl: resolveHeroImageUrl(company?.heroImageUrl),
    siteName,
  });
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const [company, services, t, tNav, tA11y] = await Promise.all([
    getCompanyProfile(),
    getServices(),
    getTranslations({ locale, namespace: "services" }),
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "a11y" }),
  ]);

  const brandName = company
    ? localized(company, locale, "shortName") ||
      localized(company, locale, "name")
    : t("title");

  const heroDescription =
    (company ? localized(company, locale, "shortDescription") : "") ||
    t("subtitle");

  const breadcrumbItems = [
    { label: tNav("home"), href: "/" },
    { label: t("title") },
  ];

  return (
    <>
      <ServicesJsonLd
        locale={locale}
        title={t("title")}
        description={t("seoDescription")}
        imageUrl={resolveHeroImageUrl(company?.heroImageUrl)}
        breadcrumb={[
          { name: tNav("home"), path: `/${locale}` },
          { name: t("title"), path: `/${locale}/services` },
        ]}
        services={services.map((service) => ({
          name: localized(service, locale, "name"),
          description: localized(service, locale, "description"),
          slug: service.slug,
          imageUrl: service.imageUrl,
        }))}
      />

      <PageHero
        title={t("title")}
        description={heroDescription}
        eyebrow={brandName}
        imageUrl={resolveHeroImageUrl(company?.heroImageUrl)}
        imageAlt={`${brandName} — ${t("title")}`}
        breadcrumb={breadcrumbItems}
        breadcrumbLabel={tA11y("breadcrumb")}
        rtlBreadcrumb={locale === "ar"}
      />

      <ServicesIntro locale={locale} company={company} />

      <ServicesFeatured locale={locale} services={services} />

      <AboutCapabilities
        locale={locale}
        company={company}
        title={t("disciplinesTitle")}
        description={t("disciplinesSubtitle")}
        id="disciplines"
      />

      <ServicesMethodology locale={locale} />

      <ServicesEquipment locale={locale} />

      <AboutSafetyQuality
        locale={locale}
        company={company}
        title={t("safetyTitle")}
        description={t("safetySubtitle")}
        id="safety"
      />

      <ServicesFaq locale={locale} />
    </>
  );
}
