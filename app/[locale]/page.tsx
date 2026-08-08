import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

import { ContactTeaser } from "@/components/public/ContactTeaser";
import { CtaSection } from "@/components/public/CtaSection";
import { FeaturedProjects } from "@/components/public/FeaturedProjects";
import { Hero } from "@/components/public/Hero";
import { IntroSection } from "@/components/public/IntroSection";
import { ProcessSection } from "@/components/public/ProcessSection";
import { ServicesSection } from "@/components/public/ServicesSection";
import { StatsSection } from "@/components/public/StatsSection";
import { ValuesStrip } from "@/components/public/ValuesStrip";
import { WhyUs } from "@/components/public/WhyUs";
import { HomeJsonLd } from "@/components/seo/HomeJsonLd";
import {
  getClients,
  getCompanyProfile,
  getPublicSiteSeo,
  getFeaturedProjects,
  getServices,
  getStatistics,
} from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { localized } from "@/lib/i18n/get-localized";
import { resolveHeroImageUrl } from "@/lib/media/public-assets";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  localizedSiteSeo,
  pickCmsOrFallback,
} from "@/lib/seo/site-defaults";

/** ISR — CMS content can lag up to 60s; improves TTFB vs force-dynamic. */
export const revalidate = 60;

const ClientsMarquee = dynamic(
  () =>
    import("@/components/public/ClientsMarquee").then(
      (mod) => mod.ClientsMarquee,
    ),
  { ssr: true },
);

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: HomePageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const [t, company, seoDefaults] = await Promise.all([
    getTranslations({ locale, namespace: "seo" }),
    getCompanyProfile(),
    getPublicSiteSeo(),
  ]);
  const siteName = company
    ? localized(company, locale, "name")
    : "Northern Meteor";
  const heroImage = resolveHeroImageUrl(company?.heroImageUrl);
  const cms = localizedSiteSeo(seoDefaults, locale);

  return buildPageMetadata({
    title: pickCmsOrFallback(cms.title, t("homeTitle")),
    description: pickCmsOrFallback(cms.description, t("homeDescription")),
    locale,
    path: `/${locale}`,
    imageUrl: heroImage,
    siteName,
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const [
    company,
    statistics,
    featuredProjects,
    services,
    clients,
    tSeo,
    tHome,
    tCta,
    tBrand,
  ] = await Promise.all([
    getCompanyProfile(),
    getStatistics(),
    getFeaturedProjects(3),
    getServices(),
    getClients(),
    getTranslations({ locale, namespace: "seo" }),
    getTranslations({ locale, namespace: "home" }),
    getTranslations({ locale, namespace: "cta" }),
    getTranslations({ locale, namespace: "brand" }),
  ]);

  const brandName = company
    ? localized(company, locale, "shortName") ||
      localized(company, locale, "name")
    : tBrand("short");

  const heroImage = resolveHeroImageUrl(company?.heroImageUrl);

  return (
    <>
      <HomeJsonLd
        locale={locale}
        title={tSeo("homeTitle")}
        description={tSeo("homeDescription")}
        imageUrl={heroImage}
      />

      <Hero
        brandName={brandName}
        title={tHome("heroTitle")}
        highlight={tHome("heroHighlight")}
        subtitle={tHome("heroSubtitle")}
        primaryCta={tCta("viewProjects")}
        secondaryCta={tCta("contactUs")}
        scrollHint={tHome("scrollHint")}
        imageUrl={heroImage}
      />

      <ValuesStrip locale={locale} />

      <FeaturedProjects locale={locale} projects={featuredProjects} />

      <IntroSection locale={locale} company={company} />

      <StatsSection locale={locale} statistics={statistics} />

      <ServicesSection locale={locale} services={services} />

      <WhyUs locale={locale} />

      <ProcessSection locale={locale} />

      <ClientsMarquee
        clients={clients.map((client) => ({
          id: client.id,
          name: client.name,
          logoUrl: client.logoUrl,
        }))}
      />

      <CtaSection locale={locale} imageUrl={heroImage} />

      <ContactTeaser locale={locale} company={company} />
    </>
  );
}
