import { getTranslations } from "next-intl/server";

import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { Reveal } from "@/components/public/motion/Reveal";
import { Timeline } from "@/components/public/Timeline";
import { Caption } from "@/components/public/typography/Caption";
import { Heading } from "@/components/public/typography/Heading";
import { Lead } from "@/components/public/typography/Lead";
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
      className="border-y border-border/70"
      padded={false}
    >
      <Container className="nm-section pt-8 md:pt-10 pb-8 md:pb-10">
        <Reveal>
          <div className="mb-6 max-w-2xl md:mb-7">
            <Caption className="tracking-[0.2em] text-gold uppercase">
              {t("processEyebrow")}
            </Caption>
            <Heading as="h2" size="h2" className="mt-3 text-balance">
              {t("processTitle")}
            </Heading>
            <Lead className="mt-3 max-w-xl text-sm md:text-base">
              {t("processSubtitle")}
            </Lead>
          </div>
        </Reveal>
        <Timeline steps={steps} />
      </Container>
    </Section>
  );
}
