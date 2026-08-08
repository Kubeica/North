import { getTranslations } from "next-intl/server";

import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { SectionTitle } from "@/components/public/layout/SectionTitle";
import { Reveal } from "@/components/public/motion/Reveal";
import { Paragraph } from "@/components/public/typography/Paragraph";
import { localized } from "@/lib/i18n/get-localized";
import type { Locale } from "@/lib/i18n/config";
import type { CompanyProfile } from "@prisma/client";

type AboutCapabilitiesProps = {
  locale: Locale;
  company: CompanyProfile | null;
  title?: string;
  description?: string;
  id?: string;
};

export async function AboutCapabilities({
  locale,
  company,
  title,
  description,
  id = "capabilities",
}: AboutCapabilitiesProps) {
  const t = await getTranslations({ locale, namespace: "about" });
  const cmsCapabilities = company
    ? localized(company, locale, "capabilities")
    : null;

  if (!cmsCapabilities && !title && !description) {
    return null;
  }

  if (!cmsCapabilities) {
    return null;
  }

  return (
    <Section tone="dark" id={id} padded={false}>
      <Container className="nm-section">
        <Reveal>
          <SectionTitle
            title={title ?? t("capabilitiesTitle")}
            description={description ?? t("capabilitiesSubtitle")}
            className="mb-6"
          />
          <Paragraph className="max-w-2xl text-muted-foreground">
            {cmsCapabilities}
          </Paragraph>
        </Reveal>
      </Container>
    </Section>
  );
}
