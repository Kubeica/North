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
import { getCompanyProfile, getServices } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { localized } from "@/lib/i18n/get-localized";
import { buildPageMetadata } from "@/lib/seo/metadata";

/** ISR — CMS content can lag up to 60s. */
export const revalidate = 60;

type ServicesPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ServicesPageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const t = await getTranslations({ locale, namespace: "services" });
  const company = await getCompanyProfile();
  const siteName = company
    ? localized(company, locale, "name")
    : "Northern Meteor Construction";

  return buildPageMetadata({
    title: t("title"),
    description: t("seoDescription") || t("subtitle"),
    locale,
    path: `/${locale}/services`,
    imageUrl: company?.heroImageUrl,
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
        imageUrl={company?.heroImageUrl}
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
        imageUrl={company?.heroImageUrl}
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
