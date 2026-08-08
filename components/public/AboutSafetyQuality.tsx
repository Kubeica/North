import { getTranslations } from "next-intl/server";

import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { SectionTitle } from "@/components/public/layout/SectionTitle";
import { Reveal } from "@/components/public/motion/Reveal";
import { Paragraph } from "@/components/public/typography/Paragraph";
import { localized } from "@/lib/i18n/get-localized";
import type { Locale } from "@/lib/i18n/config";
import type { CompanyProfile } from "@prisma/client";

type AboutSafetyQualityProps = {
  locale: Locale;
  company: CompanyProfile | null;
  title?: string;
  description?: string;
  id?: string;
};

export async function AboutSafetyQuality({
  locale,
  company,
  title,
  description,
  id = "safety-quality",
}: AboutSafetyQualityProps) {
  const t = await getTranslations({ locale, namespace: "about" });
  const safety = company ? localized(company, locale, "safety") : null;
  const quality = company ? localized(company, locale, "quality") : null;

  if (!safety && !quality) {
    return null;
  }

  return (
    <Section tone="navy" id={id} padded={false}>
      <Container className="nm-section">
        <Reveal>
          <SectionTitle
            title={title ?? t("safetyQualityTitle")}
            description={description ?? t("safetyQualitySubtitle")}
            className="mb-8"
          />
          <div className="grid gap-6 md:grid-cols-2">
            {safety ? (
              <div className="border border-border/50 bg-background/20 p-6">
                <p className="text-sm font-medium tracking-wide text-gold uppercase">
                  {t("safety")}
                </p>
                <Paragraph className="mt-3 text-sm text-muted-foreground">
                  {safety}
                </Paragraph>
              </div>
            ) : null}
            {quality ? (
              <div className="border border-border/50 bg-background/20 p-6">
                <p className="text-sm font-medium tracking-wide text-gold uppercase">
                  {t("quality")}
                </p>
                <Paragraph className="mt-3 text-sm text-muted-foreground">
                  {quality}
                </Paragraph>
              </div>
            ) : null}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
