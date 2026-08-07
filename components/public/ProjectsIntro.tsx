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

type ProjectsIntroProps = {
  locale: Locale;
  company: CompanyProfile | null;
};

export async function ProjectsIntro({ locale, company }: ProjectsIntroProps) {
  const t = await getTranslations({ locale, namespace: "projects" });
  const experience = company
    ? localized(company, locale, "experience")
    : null;

  return (
    <Section tone="dark" id="overview" padded={false}>
      <Container className="nm-section">
        <Reveal>
          <div className="max-w-3xl">
            <Caption className="tracking-[0.2em] text-gold uppercase">
              {t("overviewEyebrow")}
            </Caption>
            <Heading as="h2" size="h2" className="mt-4 text-balance">
              {t("overviewTitle")}
            </Heading>
            <Lead className="mt-5">{t("overviewLead")}</Lead>
            {experience ? (
              <Paragraph className="mt-5 text-muted-foreground">
                {experience}
              </Paragraph>
            ) : null}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
