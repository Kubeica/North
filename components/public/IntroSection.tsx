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

type IntroSectionProps = {
  locale: Locale;
  company: CompanyProfile | null;
};

export async function IntroSection({ locale, company }: IntroSectionProps) {
  const t = await getTranslations({ locale, namespace: "home" });
  if (!company) return null;

  const name = localized(company, locale, "name");
  const short = localized(company, locale, "shortDescription");
  const about = localized(company, locale, "about");
  const imageUrl = company.heroImageUrl;

  return (
    <Section tone="dark" id="intro" padded={false}>
      <Container className="nm-section">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <Caption className="tracking-[0.2em] text-gold uppercase">
              {t("introEyebrow")}
            </Caption>
            <Heading as="h2" size="h2" className="mt-4 text-balance">
              {t("introTitle")}
            </Heading>
            <Lead className="mt-5 max-w-xl">{short || name}</Lead>
            {about ? (
              <Paragraph className="mt-5 max-w-xl text-muted-foreground">
                {about.length > 420 ? `${about.slice(0, 420).trim()}…` : about}
              </Paragraph>
            ) : null}
          </Reveal>

          <Reveal className="lg:col-span-6" delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden border border-border/50 bg-surface">
              {imageUrl ? (
                <LazyImage
                  src={imageUrl}
                  alt={name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-navy via-surface to-background" />
              )}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
