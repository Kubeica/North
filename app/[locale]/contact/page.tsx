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
import { getCompanyProfile } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { localized } from "@/lib/i18n/get-localized";
import { buildPageMetadata } from "@/lib/seo/metadata";

/** ISR — company profile can lag up to 60s. */
export const revalidate = 60;

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ContactPageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const t = await getTranslations({ locale, namespace: "contact" });
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
    path: `/${locale}/contact`,
    imageUrl: company?.heroImageUrl,
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
  const hours = t("hoursValue");
  const heroDescription =
    (company ? localized(company, locale, "shortDescription") : "") ||
    t("subtitle");

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
        imageUrl={company?.heroImageUrl}
        imageAlt={`${brandName} — ${t("title")}`}
        breadcrumb={breadcrumbItems}
        breadcrumbLabel={tA11y("breadcrumb")}
        rtlBreadcrumb={locale === "ar"}
      />

      <Section id="contact-info" padded={false}>
        <Container className="nm-section">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <Reveal>
              <SectionTitle
                title={t("infoTitle")}
                description={t("infoSubtitle")}
                className="mb-8"
              />
              <ContactCard
                address={address || null}
                phone={phone || null}
                email={email || null}
                hours={hours}
              />
            </Reveal>

            <Reveal delay={0.08}>
              <SectionTitle
                title={t("mapTitle")}
                description={t("mapSubtitle")}
                className="mb-8"
              />
              <MapPlaceholder
                latitude={company?.latitude}
                longitude={company?.longitude}
                label={tHome("mapPlaceholder")}
                unavailableLabel={tHome("mapUnavailable")}
                className="min-h-[320px]"
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="surface" id="request-quote" padded={false}>
        <Container className="nm-section">
          <Reveal>
            <SectionTitle
              title={t("quote.title")}
              description={t("quote.subtitle")}
              className="mb-10"
            />
            <div className="border border-border/60 bg-background/40 p-6 md:p-10">
              <QuoteRequestForm />
            </div>
          </Reveal>
        </Container>
      </Section>

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
