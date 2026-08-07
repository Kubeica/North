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
import { WhyUs } from "@/components/public/WhyUs";
import { HomeJsonLd } from "@/components/seo/HomeJsonLd";
import {
  getClients,
  getCompanyProfile,
  getFeaturedProjects,
  getServices,
  getStatistics,
} from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { localized } from "@/lib/i18n/get-localized";
import { buildPageMetadata } from "@/lib/seo/metadata";

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
  const t = await getTranslations({ locale, namespace: "seo" });
  const company = await getCompanyProfile();
  const siteName = company
    ? localized(company, locale, "name")
    : "Northern Meteor Construction";

  return buildPageMetadata({
    title: t("homeTitle"),
    description: t("homeDescription"),
    locale,
    path: `/${locale}`,
    imageUrl: company?.heroImageUrl,
    siteName,
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const [company, statistics, featuredProjects, services, clients, tSeo] =
    await Promise.all([
      getCompanyProfile(),
      getStatistics(),
      getFeaturedProjects(6),
      getServices(),
      getClients(),
      getTranslations({ locale, namespace: "seo" }),
    ]);

  const brandName = company
    ? localized(company, locale, "shortName") ||
      localized(company, locale, "name")
    : undefined;

  return (
    <>
      <HomeJsonLd
        locale={locale}
        title={tSeo("homeTitle")}
        description={tSeo("homeDescription")}
        imageUrl={company?.heroImageUrl}
      />

      <Hero brandName={brandName} imageUrl={company?.heroImageUrl} />

      <IntroSection locale={locale} company={company} />

      <StatsSection locale={locale} statistics={statistics} />

      <ServicesSection locale={locale} services={services} />

      <FeaturedProjects locale={locale} projects={featuredProjects} />

      <WhyUs locale={locale} />

      <ProcessSection locale={locale} />

      <ClientsMarquee clients={clients} />

      <CtaSection locale={locale} />

      <ContactTeaser locale={locale} company={company} />
    </>
  );
}
