import { getTranslations } from "next-intl/server";

import { AnimatedCounter } from "@/components/public/AnimatedCounter";
import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { Reveal } from "@/components/public/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/public/motion/Stagger";
import { StatisticCard } from "@/components/public/StatisticCard";
import { Heading } from "@/components/public/typography/Heading";
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
        : statistics.length === 5
          ? "lg:grid-cols-5"
          : "lg:grid-cols-3";

  return (
    <Section
      tone="navy"
      id={id}
      className="border-y border-border/70"
      padded={false}
    >
      <Container className="nm-section">
        <Reveal>
          <Heading as="h2" size="h3" className="mb-8 max-w-xl text-balance md:mb-10">
            {title ?? t("statisticsTitle")}
          </Heading>
          {description ? (
            <p className="sr-only">{description}</p>
          ) : null}
        </Reveal>

        <Stagger
          className={`grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 md:grid-cols-3 md:gap-y-12 ${cols}`}
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
