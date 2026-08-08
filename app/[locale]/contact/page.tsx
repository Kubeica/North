import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContactCard } from "@/components/public/ContactCard";
import { ContactFaq } from "@/components/public/ContactFaq";
import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { SectionTitle } from "@/components/public/layout/SectionTitle";
import { MapPlaceholder } from "@/components/public/MapPlaceholder";
import { Reveal } from "@/components/public/motion/Reveal";
import { PageHero } from "@/components/public/PageHero";
import { QuoteRequestForm } from "@/components/public/QuoteRequestForm";
import { CTASection } from "@/components/public/sections/CTASection";
import { WhyUs } from "@/components/public/WhyUs";
import { ContactJsonLd } from "@/components/seo/ContactJsonLd";
import { getCompanyProfile, getPublicSiteSeo } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { localized } from "@/lib/i18n/get-localized";
import { resolveHeroImageUrl } from "@/lib/media/public-assets";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  localizedSiteSeo,
  pickCmsOrFallback,
} from "@/lib/seo/site-defaults";

/** ISR — company profile can lag up to 60s. */
export const revalidate = 60;

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ContactPageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const [t, company, seoDefaults] = await Promise.all([
    getTranslations({ locale, namespace: "contact" }),
    getCompanyProfile(),
    getPublicSiteSeo(),
  ]);
  const siteName = company
    ? localized(company, locale, "name")
    : "Northern Meteor";
  const cms = localizedSiteSeo(seoDefaults, locale);
  const description =
    t("seoDescription") ||
    (company ? localized(company, locale, "shortDescription") : "") ||
    pickCmsOrFallback(cms.description, t("subtitle"));

  return buildPageMetadata({
    title: t("title"),
    description,
    locale,
    path: `/${locale}/contact`,
    imageUrl: resolveHeroImageUrl(company?.heroImageUrl),
    siteName,
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const [company, t, tNav, tA11y, tCta, tHome] = await Promise.all([
    getCompanyProfile(),
    getTranslations({ locale, namespace: "contact" }),
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "a11y" }),
    getTranslations({ locale, namespace: "cta" }),
    getTranslations({ locale, namespace: "home" }),
  ]);

  const brandName = company
    ? localized(company, locale, "shortName") ||
      localized(company, locale, "name")
    : t("title");

  const address = company ? localized(company, locale, "address") : "";
  const phone = company?.phone ?? "";
  const email = company?.email ?? "";
  const heroDescription =
    (company ? localized(company, locale, "shortDescription") : "") ||
    t("subtitle");

  const hasMapCoords =
    company?.latitude != null &&
    company?.longitude != null &&
    Number.isFinite(company.latitude) &&
    Number.isFinite(company.longitude);

  const breadcrumbItems = [
    { label: tNav("home"), href: "/" },
    { label: t("title") },
  ];

  return (
    <>
      <ContactJsonLd
        locale={locale}
        title={t("title")}
        description={t("seoDescription")}
        phone={phone || null}
        email={email || null}
        address={address || null}
        latitude={company?.latitude}
        longitude={company?.longitude}
        breadcrumb={[
          { name: tNav("home"), path: `/${locale}` },
          { name: t("title"), path: `/${locale}/contact` },
        ]}
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

      <Section id="contact-info" padded={false}>
        <Container className="nm-section py-8 md:py-10">
          <Reveal>
            <SectionTitle
              title={t("infoTitle")}
              description={t("infoSubtitle")}
              className="mb-5 max-w-2xl"
            />
            <div className="max-w-xl">
              <ContactCard
                address={address || null}
                phone={phone || null}
                email={email || null}
              />
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section tone="surface" id="request-quote" padded={false}>
        <Container className="nm-section py-8 md:py-10">
          <Reveal>
            <SectionTitle
              title={t("quote.title")}
              description={t("quote.subtitle")}
              className="mb-5 max-w-2xl"
            />
            <div className="bg-background/45 p-5 ring-1 ring-border/45 md:p-8">
              <QuoteRequestForm />
            </div>
          </Reveal>
        </Container>
      </Section>

      {hasMapCoords ? (
        <Section id="map" padded={false}>
          <Container className="nm-section py-8 md:py-10">
            <Reveal>
              <SectionTitle
                title={t("mapTitle")}
                description={t("mapSubtitle")}
                className="mb-5 max-w-2xl"
              />
              <MapPlaceholder
                latitude={company?.latitude}
                longitude={company?.longitude}
                label={tHome("mapPlaceholder")}
                unavailableLabel={tHome("mapUnavailable")}
              />
            </Reveal>
          </Container>
        </Section>
      ) : null}

      <WhyUs locale={locale} />

      <ContactFaq locale={locale} />

      <CTASection
        title={t("ctaTitle")}
        description={t("ctaSubtitle")}
        primaryAction={{
          label: tCta("requestQuote"),
          href: "#request-quote",
        }}
        secondaryAction={{
          label: tNav("projects"),
          href: "/projects",
        }}
      />
    </>
  );
}
