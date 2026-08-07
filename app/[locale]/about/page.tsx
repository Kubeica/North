import { getTranslations, setRequestLocale } from "next-intl/server";

import { AboutCapabilities } from "@/components/public/AboutCapabilities";
import { AboutCertifications } from "@/components/public/AboutCertifications";
import { AboutLeadership } from "@/components/public/AboutLeadership";
import { AboutMilestones } from "@/components/public/AboutMilestones";
import { AboutSafetyQuality } from "@/components/public/AboutSafetyQuality";
import { AboutValues } from "@/components/public/AboutValues";
import { AboutVisionMission } from "@/components/public/AboutVisionMission";
import { AboutWhoWeAre } from "@/components/public/AboutWhoWeAre";
import { PageHero } from "@/components/public/PageHero";
import { CTASection } from "@/components/public/sections/CTASection";
import { StatsSection } from "@/components/public/StatsSection";
import { AboutJsonLd } from "@/components/seo/AboutJsonLd";
import {
  getCompanyMilestones,
  getCompanyProfile,
  getStatistics,
  getTeamMembers,
} from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { localized } from "@/lib/i18n/get-localized";
import { buildPageMetadata } from "@/lib/seo/metadata";

/** ISR — CMS content can lag up to 60s; improves TTFB vs force-dynamic. */
export const revalidate = 60;

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: AboutPageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const t = await getTranslations({ locale, namespace: "about" });
  const company = await getCompanyProfile();
  const siteName = company
    ? localized(company, locale, "name")
    : "Northern Meteor Construction";
  const description =
    t("seoDescription") ||
    (company ? localized(company, locale, "shortDescription") : "") ||
    t("subtitle");

  return buildPageMetadata({
    title: t("title"),
    description,
    locale,
    path: `/${locale}/about`,
    imageUrl: company?.heroImageUrl,
    siteName,
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const [company, statistics, members, milestones, t, tNav, tA11y, tCta] =
    await Promise.all([
      getCompanyProfile(),
      getStatistics(),
      getTeamMembers(),
      getCompanyMilestones(),
      getTranslations({ locale, namespace: "about" }),
      getTranslations({ locale, namespace: "nav" }),
      getTranslations({ locale, namespace: "a11y" }),
      getTranslations({ locale, namespace: "cta" }),
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
      <AboutJsonLd
        locale={locale}
        title={t("title")}
        description={t("seoDescription")}
        imageUrl={company?.heroImageUrl}
        breadcrumb={[
          { name: tNav("home"), path: `/${locale}` },
          { name: t("title"), path: `/${locale}/about` },
        ]}
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

      <AboutWhoWeAre locale={locale} company={company} />

      <AboutVisionMission locale={locale} company={company} />

      <AboutValues locale={locale} company={company} />

      <AboutLeadership locale={locale} members={members} />

      <AboutCapabilities locale={locale} company={company} />

      <StatsSection
        locale={locale}
        statistics={statistics}
        title={t("trustTitle")}
        description={t("trustSubtitle")}
        id="trust"
      />

      <AboutSafetyQuality locale={locale} company={company} />

      <AboutMilestones locale={locale} milestones={milestones} />

      <AboutCertifications locale={locale} />

      <CTASection
        title={t("ctaTitle")}
        description={t("ctaSubtitle")}
        primaryAction={{
          label: tCta("viewProjects"),
          href: "/projects",
        }}
        secondaryAction={{
          label: tCta("contactUs"),
          href: "/contact",
        }}
        className="bg-navy"
      />
    </>
  );
}
