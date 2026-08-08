import { getTranslations } from "next-intl/server";

import { PublicButton } from "@/components/public/buttons/PublicButton";
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

type IntroSectionProps = {
  locale: Locale;
  company: CompanyProfile | null;
};

export async function IntroSection({ locale, company }: IntroSectionProps) {
  const t = await getTranslations({ locale, namespace: "home" });
  const tCta = await getTranslations({ locale, namespace: "cta" });
  if (!company) return null;

  const name = localized(company, locale, "name");
  const short = localized(company, locale, "shortDescription");
  const about = localized(company, locale, "about");
  return (
    <Section tone="dark" id="intro" padded={false}>
      <Container className="nm-section">
        <div className="grid items-stretch gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="flex flex-col justify-center lg:col-span-5 lg:col-start-1">
            <Caption className="tracking-[0.22em] text-gold uppercase">
              {t("introEyebrow")}
            </Caption>
            <Heading
              as="h2"
              size="h1"
              className="mt-5 max-w-[16ch] text-balance"
            >
              {t("introTitle")}
            </Heading>
            <Lead className="mt-6 max-w-md text-pretty text-foreground/85">
              {short || name}
            </Lead>
            {about ? (
              <Paragraph className="mt-5 max-w-md text-pretty text-muted-foreground">
                {about.length > 360 ? `${about.slice(0, 360).trim()}…` : about}
              </Paragraph>
            ) : null}
            <div className="mt-9">
              <PublicButton href="/about" variant="outline">
                {tCta("learnMore")}
              </PublicButton>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-7 lg:col-start-6" delay={0.1}>
            <div className="relative overflow-hidden bg-surface">
              <ArchitecturalImage
                src={company.heroImageUrl}
                alt={name}
                seed="home-intro"
                overlay
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="aspect-[5/4] md:aspect-[16/11] lg:aspect-[4/3]"
              />
              <div
                aria-hidden
                className="absolute inset-y-0 start-0 w-px bg-gradient-to-b from-gold/0 via-gold to-gold/0"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
