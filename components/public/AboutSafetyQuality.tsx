import {
  ClipboardCheck,
  RefreshCw,
  ShieldAlert,
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

const PILLARS = [
  { key: "hse" as const, icon: ShieldCheck },
  { key: "qa" as const, icon: ClipboardCheck },
  { key: "risk" as const, icon: ShieldAlert },
  { key: "improvement" as const, icon: RefreshCw },
];

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

  return (
    <Section tone="navy" id={id} padded={false}>
      <Container className="nm-section">
        <Reveal>
          <SectionTitle
            title={title ?? t("safetyQualityTitle")}
            description={description ?? t("safetyQualitySubtitle")}
            className="mb-8"
          />
          <div className="mb-12 grid gap-6 md:grid-cols-2">
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

        <Stagger className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar) => (
            <StaggerItem key={pillar.key}>
              <FeatureCard
                icon={pillar.icon}
                title={t(`safetyPillars.${pillar.key}.title`)}
                description={t(`safetyPillars.${pillar.key}.body`)}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
