import {
  BadgeCheck,
  Leaf,
  Lightbulb,
  Scale,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { FeatureCard } from "@/components/public/FeatureCard";
import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { SectionTitle } from "@/components/public/layout/SectionTitle";
import { Reveal } from "@/components/public/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/public/motion/Stagger";
import { Paragraph } from "@/components/public/typography/Paragraph";
import { localized } from "@/lib/i18n/get-localized";
import type { Locale } from "@/lib/i18n/config";
import type { CompanyProfile } from "@prisma/client";

type AboutValuesProps = {
  locale: Locale;
  company: CompanyProfile | null;
};

const VALUES = [
  { key: "integrity" as const, icon: Scale },
  { key: "quality" as const, icon: BadgeCheck },
  { key: "safety" as const, icon: ShieldCheck },
  { key: "innovation" as const, icon: Lightbulb },
  { key: "reliability" as const, icon: Wrench },
  { key: "sustainability" as const, icon: Leaf },
];

export async function AboutValues({ locale, company }: AboutValuesProps) {
  const t = await getTranslations({ locale, namespace: "about" });
  const valuesSummary = company
    ? localized(company, locale, "values")
    : null;

  return (
    <Section tone="dark" id="values" padded={false}>
      <Container className="nm-section">
        <Reveal>
          <SectionTitle
            title={t("valuesTitle")}
            description={t("valuesSubtitle")}
            className="mb-6"
          />
          {valuesSummary ? (
            <Paragraph className="mb-12 max-w-2xl text-muted-foreground">
              {valuesSummary}
            </Paragraph>
          ) : null}
        </Reveal>

        <Stagger
          className={`nm-grid-features ${valuesSummary ? "" : "mt-12"}`}
        >
          {VALUES.map((value) => (
            <StaggerItem key={value.key}>
              <FeatureCard
                icon={value.icon}
                title={t(`coreValues.${value.key}.title`)}
                description={t(`coreValues.${value.key}.body`)}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
