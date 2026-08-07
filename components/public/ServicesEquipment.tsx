import { getTranslations } from "next-intl/server";

import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { SectionTitle } from "@/components/public/layout/SectionTitle";
import { Reveal } from "@/components/public/motion/Reveal";
import { Paragraph } from "@/components/public/typography/Paragraph";
import type { Locale } from "@/lib/i18n/config";

type ServicesEquipmentProps = {
  locale: Locale;
};

/**
 * Technology & equipment placeholder — does not invent equipment lists.
 * Ready for CMS equipment data when available.
 */
export async function ServicesEquipment({ locale }: ServicesEquipmentProps) {
  const t = await getTranslations({ locale, namespace: "services" });

  return (
    <Section tone="dark" id="equipment" padded={false}>
      <Container className="nm-section">
        <Reveal>
          <SectionTitle
            title={t("equipment.title")}
            description={t("equipment.subtitle")}
            className="mb-10"
          />
          <div
            className="flex min-h-[10rem] items-center justify-center border border-dashed border-border/70 bg-surface/20 px-6 py-12 text-center"
            role="status"
          >
            <Paragraph className="max-w-md text-muted-foreground">
              {t("equipment.placeholder")}
            </Paragraph>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
