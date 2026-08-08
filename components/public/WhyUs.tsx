import {
  Award,
  Clock3,
  Layers,
  ShieldCheck,
  UsersRound,
  Wrench,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { Reveal } from "@/components/public/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/public/motion/Stagger";
import { Caption } from "@/components/public/typography/Caption";
import { Heading } from "@/components/public/typography/Heading";
import { Lead } from "@/components/public/typography/Lead";
import { Paragraph } from "@/components/public/typography/Paragraph";
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
] as const;

export async function WhyUs({ locale }: WhyUsProps) {
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <Section
      tone="surface"
      id="why-us"
      padded={false}
      className="bg-surface-2"
    >
      <Container className="nm-section pb-8 md:pb-10">
        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-4 lg:self-start">
            <Caption className="tracking-[0.2em] text-gold uppercase">
              {t("whyUsEyebrow")}
            </Caption>
            <Heading
              as="h2"
              size="h2"
              className="mt-3 max-w-[14ch] text-balance"
            >
              {t("whyUsTitle")}
            </Heading>
            <Lead className="mt-3 max-w-sm text-pretty text-sm md:text-base">
              {t("whyUsSubtitle")}
            </Lead>
            <div
              aria-hidden
              className="mt-5 hidden h-px w-14 bg-gold/60 lg:block"
            />
          </Reveal>

          <Stagger className="grid gap-0 sm:grid-cols-2 lg:col-span-8">
            {PILLARS.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <StaggerItem key={pillar.key}>
                  <article
                    className={
                      index % 2 === 0
                        ? "border-t border-border/55 py-5 pe-0 sm:pe-7"
                        : "border-t border-border/55 py-5 ps-0 sm:ps-7"
                    }
                  >
                    <Icon
                      className="mb-3 size-[1.05rem] stroke-[1.15] text-gold"
                      aria-hidden
                    />
                    <Heading as="h3" size="h4" className="text-foreground">
                      {t(`whyUs.${pillar.key}.title`)}
                    </Heading>
                    <Paragraph className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                      {t(`whyUs.${pillar.key}.body`)}
                    </Paragraph>
                  </article>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </Container>
    </Section>
  );
}
