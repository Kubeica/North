import { getTranslations } from "next-intl/server";

import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { SectionTitle } from "@/components/public/layout/SectionTitle";
import { Reveal } from "@/components/public/motion/Reveal";
import { Timeline } from "@/components/public/Timeline";
import type { Locale } from "@/lib/i18n/config";

type ProcessSectionProps = {
  locale: Locale;
};

const STEP_KEYS = [
  "consultation",
  "planning",
  "engineering",
  "execution",
  "quality",
  "handover",
] as const;

export async function ProcessSection({ locale }: ProcessSectionProps) {
  const t = await getTranslations({ locale, namespace: "home" });

  const steps = STEP_KEYS.map((key) => ({
    title: t(`process.${key}`),
  }));

  return (
    <Section
      tone="surface"
      id="process"
      className="border-y border-border"
      padded={false}
    >
      <Container className="nm-section">
        <Reveal>
          <SectionTitle
            title={t("processTitle")}
            description={t("processSubtitle")}
            className="mb-12"
          />
        </Reveal>
        <Timeline steps={steps} className="lg:grid-cols-6" />
      </Container>
    </Section>
  );
}
