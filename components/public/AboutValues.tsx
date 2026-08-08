import { getTranslations } from "next-intl/server";

import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { SectionTitle } from "@/components/public/layout/SectionTitle";
import { Reveal } from "@/components/public/motion/Reveal";
import { Paragraph } from "@/components/public/typography/Paragraph";
import { localized } from "@/lib/i18n/get-localized";
import type { Locale } from "@/lib/i18n/config";
import type { CompanyProfile } from "@prisma/client";

type AboutValuesProps = {
  locale: Locale;
  company: CompanyProfile | null;
};

export async function AboutValues({ locale, company }: AboutValuesProps) {
  const t = await getTranslations({ locale, namespace: "about" });
  const valuesSummary = company
    ? localized(company, locale, "values")
    : null;

  if (!valuesSummary) {
    return null;
  }

  return (
    <Section tone="dark" id="values" padded={false}>
      <Container className="nm-section">
        <Reveal>
          <SectionTitle
            title={t("valuesTitle")}
            description={t("valuesSubtitle")}
            className="mb-6"
          />
          <Paragraph className="max-w-2xl text-muted-foreground">
            {valuesSummary}
          </Paragraph>
        </Reveal>
      </Container>
    </Section>
  );
}
