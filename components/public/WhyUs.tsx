import {
  Award,
  Clock3,
  Layers,
  ShieldCheck,
  UsersRound,
  Wrench,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { FeatureCard } from "@/components/public/FeatureCard";
import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { SectionTitle } from "@/components/public/layout/SectionTitle";
import { Reveal } from "@/components/public/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/public/motion/Stagger";
import type { Locale } from "@/lib/i18n/config";

type WhyUsProps = {
  locale: Locale;
};

const PILLARS = [
  { key: "quality" as const, icon: Award },
  { key: "safety" as const, icon: ShieldCheck },
  { key: "reliability" as const, icon: Wrench },
  { key: "onTime" as const, icon: Clock3 },
  { key: "team" as const, icon: UsersRound },
  { key: "solutions" as const, icon: Layers },
];

export async function WhyUs({ locale }: WhyUsProps) {
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <Section tone="dark" id="why-us" padded={false}>
      <Container className="nm-section">
        <Reveal>
          <SectionTitle
            title={t("whyUsTitle")}
            description={t("whyUsSubtitle")}
            className="mb-12"
          />
        </Reveal>

        <Stagger className="nm-grid-features">
          {PILLARS.map((pillar) => (
            <StaggerItem key={pillar.key}>
              <FeatureCard
                icon={pillar.icon}
                title={t(`whyUs.${pillar.key}.title`)}
                description={t(`whyUs.${pillar.key}.body`)}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
