import { getTranslations } from "next-intl/server";

import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { SectionTitle } from "@/components/public/layout/SectionTitle";
import { Reveal } from "@/components/public/motion/Reveal";
import { Timeline } from "@/components/public/Timeline";
import type { Locale } from "@/lib/i18n/config";

type ServicesMethodologyProps = {
  locale: Locale;
};

const STEP_KEYS = [
  "planning",
  "engineering",
  "execution",
  "qa",
  "delivery",
] as const;

export async function ServicesMethodology({
  locale,
}: ServicesMethodologyProps) {
  const t = await getTranslations({ locale, namespace: "services" });

  const steps = STEP_KEYS.map((key) => ({
    title: t(`methodology.steps.${key}.title`),
    description: t(`methodology.steps.${key}.body`),
  }));

  return (
    <Section
      tone="surface"
      id="methodology"
      className="border-y border-border"
      padded={false}
    >
      <Container className="nm-section">
        <Reveal>
          <SectionTitle
            title={t("methodology.title")}
            description={t("methodology.subtitle")}
            className="mb-12"
          />
        </Reveal>
        <Timeline steps={steps} className="lg:grid-cols-5" />
      </Container>
    </Section>
  );
}
