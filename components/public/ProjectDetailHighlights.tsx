import {
  ClipboardCheck,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { FeatureCard } from "@/components/public/FeatureCard";
import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { SectionTitle } from "@/components/public/layout/SectionTitle";
import { Reveal } from "@/components/public/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/public/motion/Stagger";
import { Paragraph } from "@/components/public/typography/Paragraph";
import type { Locale } from "@/lib/i18n/config";

type ProjectDetailHighlightsProps = {
  locale: Locale;
};

const PLACEHOLDER_KEYS = [
  { key: "coordination" as const, icon: Layers },
  { key: "quality" as const, icon: ClipboardCheck },
  { key: "safety" as const, icon: ShieldCheck },
];

/**
 * Engineering highlights placeholders until a dedicated CMS field exists.
 * Generic delivery themes only — does not invent project-specific claims.
 */
export async function ProjectDetailHighlights({
  locale,
}: ProjectDetailHighlightsProps) {
  const t = await getTranslations({ locale, namespace: "projects" });

  return (
    <Section tone="surface" id="highlights" padded={false}>
      <Container className="nm-section">
        <Reveal>
          <SectionTitle
            title={t("detail.highlightsTitle")}
            description={t("detail.highlightsSubtitle")}
            className="mb-4"
          />
          <Paragraph className="mb-10 max-w-2xl text-sm text-muted-foreground">
            {t("detail.highlightsNote")}
          </Paragraph>
        </Reveal>

        <Stagger className="grid gap-8 md:grid-cols-3">
          {PLACEHOLDER_KEYS.map((item) => (
            <StaggerItem key={item.key}>
              <FeatureCard
                icon={item.icon}
                title={t(`detail.highlightPlaceholders.${item.key}.title`)}
                description={t(`detail.highlightPlaceholders.${item.key}.body`)}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
