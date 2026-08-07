import { getTranslations } from "next-intl/server";

import { FeatureCard } from "@/components/public/FeatureCard";
import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { SectionTitle } from "@/components/public/layout/SectionTitle";
import { Reveal } from "@/components/public/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/public/motion/Stagger";
import { localized } from "@/lib/i18n/get-localized";
import type { Locale } from "@/lib/i18n/config";
import type { CompanyProfile } from "@prisma/client";

type AboutVisionMissionProps = {
  locale: Locale;
  company: CompanyProfile | null;
};

export async function AboutVisionMission({
  locale,
  company,
}: AboutVisionMissionProps) {
  const t = await getTranslations({ locale, namespace: "about" });

  const vision = company ? localized(company, locale, "vision") : null;
  const mission = company ? localized(company, locale, "mission") : null;
  const philosophy = t("philosophy.body");

  if (!vision && !mission && !philosophy) return null;

  return (
    <Section tone="surface" id="vision-mission" padded={false}>
      <Container className="nm-section">
        <Reveal>
          <SectionTitle
            title={t("visionMissionTitle")}
            description={t("visionMissionSubtitle")}
            className="mb-12"
          />
        </Reveal>

        <Stagger className="grid gap-10 md:grid-cols-3">
          {vision ? (
            <StaggerItem>
              <FeatureCard title={t("vision")} description={vision} />
            </StaggerItem>
          ) : null}
          {mission ? (
            <StaggerItem>
              <FeatureCard title={t("mission")} description={mission} />
            </StaggerItem>
          ) : null}
          <StaggerItem>
            <FeatureCard
              title={t("philosophy.title")}
              description={philosophy}
            />
          </StaggerItem>
        </Stagger>
      </Container>
    </Section>
  );
}
