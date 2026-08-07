import { getTranslations } from "next-intl/server";

import { Faq } from "@/components/public/Faq";
import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { SectionTitle } from "@/components/public/layout/SectionTitle";
import { Reveal } from "@/components/public/motion/Reveal";
import type { Locale } from "@/lib/i18n/config";

type ContactFaqProps = {
  locale: Locale;
};

const FAQ_KEYS = [
  "response",
  "info",
  "visit",
  "languages",
  "attachments",
] as const;

/** Contact FAQ from messages until a FAQ CMS entity exists. */
export async function ContactFaq({ locale }: ContactFaqProps) {
  const t = await getTranslations({ locale, namespace: "contact" });

  const items = FAQ_KEYS.map((key) => ({
    question: t(`faq.items.${key}.question`),
    answer: t(`faq.items.${key}.answer`),
  }));

  return (
    <Section tone="surface" id="faq" padded={false}>
      <Container className="nm-section">
        <Reveal>
          <SectionTitle
            title={t("faq.title")}
            description={t("faq.subtitle")}
            className="mb-10"
          />
          <Faq items={items} />
        </Reveal>
      </Container>
    </Section>
  );
}
