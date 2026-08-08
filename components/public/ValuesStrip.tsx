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
import type { Locale } from "@/lib/i18n/config";

type ValuesStripProps = {
  locale: Locale;
};

const ITEMS = [
  { key: "quality" as const, icon: Award },
  { key: "team" as const, icon: UsersRound },
  { key: "onTime" as const, icon: Clock3 },
  { key: "solutions" as const, icon: Layers },
  { key: "safety" as const, icon: ShieldCheck },
  { key: "reliability" as const, icon: Wrench },
] as const;

/** Horizontal premium values strip under the hero (Design D). */
export async function ValuesStrip({ locale }: ValuesStripProps) {
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <Section
      tone="surface"
      id="values-strip"
      padded={false}
      className="border-y border-border/70 bg-surface"
    >
      <Container className="py-10 md:py-12">
        <ul className="grid gap-8 sm:grid-cols-2 sm:gap-x-0 sm:gap-y-8 lg:grid-cols-3 xl:grid-cols-6 xl:gap-0">
          {ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <li
                key={item.key}
                className={
                  index === 0
                    ? "border-border/55 sm:border-e sm:pe-6 xl:pe-5"
                    : "border-border/55 sm:border-e sm:px-6 xl:px-5 xl:last:border-e-0 xl:last:pe-0"
                }
              >
                <div className="flex h-full flex-col gap-2.5">
                  <Icon
                    className="size-[1.1rem] stroke-[1.15] text-gold"
                    aria-hidden
                  />
                  <p className="text-[0.92rem] font-semibold tracking-wide text-gold">
                    {t(`whyUs.${item.key}.title`)}
                  </p>
                  <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                    {t(`whyUs.${item.key}.body`)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
