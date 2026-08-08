import { getTranslations } from "next-intl/server";

import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { Reveal } from "@/components/public/motion/Reveal";
import { Caption } from "@/components/public/typography/Caption";
import { Heading } from "@/components/public/typography/Heading";
import { Lead } from "@/components/public/typography/Lead";
import { Paragraph } from "@/components/public/typography/Paragraph";
import { localized } from "@/lib/i18n/get-localized";
import type { Locale } from "@/lib/i18n/config";
import type { CompanyProfile } from "@prisma/client";

type ServicesIntroProps = {
  locale: Locale;
  company: CompanyProfile | null;
};

export async function ServicesIntro({ locale, company }: ServicesIntroProps) {
  const t = await getTranslations({ locale, namespace: "services" });

  const capabilities = company
    ? localized(company, locale, "capabilities")
    : null;
  const short = company
    ? localized(company, locale, "shortDescription")
    : null;

  return (
    <Section tone="dark" id="introduction" padded={false}>
      <Container className="nm-section pb-0 md:pb-2">
        <Reveal>
          <div className="max-w-3xl">
            <Caption className="tracking-[0.2em] text-gold uppercase">
              {t("introEyebrow")}
            </Caption>
            <Heading as="h2" size="h2" className="mt-3 text-balance">
              {t("introTitle")}
            </Heading>
            <Lead className="mt-3 text-sm md:text-base">{t("introLead")}</Lead>
            {short ? (
              <Paragraph className="mt-4 text-muted-foreground">{short}</Paragraph>
            ) : null}
            {capabilities ? (
              <Paragraph className="mt-3 text-muted-foreground">
                {capabilities}
              </Paragraph>
            ) : null}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
