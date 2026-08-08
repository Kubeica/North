import { getTranslations } from "next-intl/server";

import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { ArchitecturalImage } from "@/components/public/media/ArchitecturalImage";
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
  return (
    <Section tone="dark" id="who-we-are" padded={false}>
      <Container className="nm-section">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-6 lg:sticky lg:top-28">
            <div className="relative overflow-hidden bg-surface">
              <ArchitecturalImage
                src={company.heroImageUrl}
                alt={name}
                seed="about-who"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]"
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-gold/0 via-gold to-gold/0"
              />
            </div>
          </Reveal>

          <Reveal className="lg:col-span-6" delay={0.08}>
            <Caption className="tracking-[0.2em] text-gold uppercase">
              {t("whoWeAre.eyebrow")}
            </Caption>
            <Heading as="h2" size="h2" className="mt-4 max-w-[16ch] text-balance">
              {t("whoWeAre.title")}
            </Heading>
            <Lead className="mt-5 max-w-md text-pretty">{short || name}</Lead>

            {about ? (
              <Paragraph className="mt-6 max-w-md text-pretty text-muted-foreground">
                {about}
              </Paragraph>
            ) : null}

            {experience ? (
              <div className="mt-10 border-s-2 border-gold/55 ps-5">
                <Caption className="tracking-[0.14em] text-gold uppercase">
                  {t("experience")}
                </Caption>
                <Paragraph className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {experience}
                </Paragraph>
              </div>
            ) : null}

            {mission ? (
              <blockquote className="mt-10 border border-border/50 bg-surface/35 p-6 md:p-7">
                <Caption className="tracking-[0.14em] text-gold uppercase">
                  {t("mission")}
                </Caption>
                <p className="mt-3 max-w-md text-base leading-relaxed text-foreground/90">
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
