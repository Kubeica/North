import { getTranslations } from "next-intl/server";

import { AnimatedCounter } from "@/components/public/AnimatedCounter";
import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { SectionTitle } from "@/components/public/layout/SectionTitle";
import { Reveal } from "@/components/public/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/public/motion/Stagger";
import { StatisticCard } from "@/components/public/StatisticCard";
import { localized } from "@/lib/i18n/get-localized";
import type { Locale } from "@/lib/i18n/config";
import type { Statistic } from "@prisma/client";

type StatsSectionProps = {
  locale: Locale;
  statistics: Statistic[];
  title?: string;
  description?: string;
  id?: string;
};

export async function StatsSection({
  locale,
  statistics,
  title,
  description,
  id = "statistics",
}: StatsSectionProps) {
  const t = await getTranslations({ locale, namespace: "home" });

  if (statistics.length === 0) return null;

  const cols =
    statistics.length >= 6
      ? "lg:grid-cols-6"
      : statistics.length === 4
        ? "lg:grid-cols-4"
        : "lg:grid-cols-3";

  return (
    <Section
      tone="surface"
      id={id}
      className="border-y border-border"
      padded={false}
    >
      <Container className="nm-section">
        <Reveal>
          <SectionTitle
            title={title ?? t("statisticsTitle")}
            description={description ?? t("statisticsSubtitle")}
            className="mb-12"
          />
        </Reveal>

        <Stagger
          className={`grid grid-cols-2 gap-8 md:grid-cols-3 ${cols}`}
        >
          {statistics.map((stat) => (
            <StaggerItem key={stat.id}>
              <StatisticCard
                value={<AnimatedCounter value={stat.value} />}
                label={localized(stat, locale, "label")}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
