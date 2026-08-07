import { getTranslations } from "next-intl/server";

import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { LazyImage } from "@/components/public/media/LazyImage";
import { Reveal } from "@/components/public/motion/Reveal";
import { Caption } from "@/components/public/typography/Caption";
import { Heading } from "@/components/public/typography/Heading";
import { Lead } from "@/components/public/typography/Lead";
import { Paragraph } from "@/components/public/typography/Paragraph";
import { localized } from "@/lib/i18n/get-localized";
import type { Locale } from "@/lib/i18n/config";
import type { CompanyProfile } from "@prisma/client";

type AboutWhoWeAreProps = {
  locale: Locale;
  company: CompanyProfile | null;
};

export async function AboutWhoWeAre({ locale, company }: AboutWhoWeAreProps) {
  const t = await getTranslations({ locale, namespace: "about" });
  if (!company) return null;

  const name = localized(company, locale, "name");
  const about = localized(company, locale, "about");
  const experience = localized(company, locale, "experience");
  const mission = localized(company, locale, "mission");
  const short = localized(company, locale, "shortDescription");
  const imageUrl = company.heroImageUrl;

  return (
    <Section tone="dark" id="who-we-are" padded={false}>
      <Container className="nm-section">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6 lg:sticky lg:top-28">
            <div className="relative aspect-[4/5] overflow-hidden border border-border/50 bg-surface sm:aspect-[4/3] lg:aspect-[4/5]">
              {imageUrl ? (
                <LazyImage
                  src={imageUrl}
                  alt={name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0 bg-gradient-to-br from-navy via-surface to-background"
                  aria-hidden
                />
              )}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0"
              />
            </div>
          </Reveal>

          <Reveal className="lg:col-span-6" delay={0.08}>
            <Caption className="tracking-[0.2em] text-gold uppercase">
              {t("whoWeAre.eyebrow")}
            </Caption>
            <Heading as="h2" size="h2" className="mt-4 text-balance">
              {t("whoWeAre.title")}
            </Heading>
            <Lead className="mt-5 max-w-xl">{short || name}</Lead>

            {about ? (
              <Paragraph className="mt-6 max-w-xl text-muted-foreground">
                {about}
              </Paragraph>
            ) : null}

            {experience ? (
              <div className="mt-8 border-s-2 border-gold/50 ps-5">
                <Caption className="tracking-[0.14em] text-gold uppercase">
                  {t("experience")}
                </Caption>
                <Paragraph className="mt-3 text-sm text-muted-foreground">
                  {experience}
                </Paragraph>
              </div>
            ) : null}

            {mission ? (
              <blockquote className="mt-8 border border-border/60 bg-surface/40 p-6">
                <Caption className="tracking-[0.14em] text-gold uppercase">
                  {t("mission")}
                </Caption>
                <p className="mt-3 text-base leading-relaxed text-foreground/90">
                  {mission}
                </p>
              </blockquote>
            ) : null}
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
