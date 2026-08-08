import { getTranslations } from "next-intl/server";

import { CTASection } from "@/components/public/sections/CTASection";
import type { Locale } from "@/lib/i18n/config";

type CtaSectionProps = {
  locale: Locale;
  imageUrl?: string | null;
};

/** Localized CTA — composes the design-system `CTASection`. */
export async function CtaSection({ locale, imageUrl }: CtaSectionProps) {
  const t = await getTranslations({ locale, namespace: "home" });
  const tCta = await getTranslations({ locale, namespace: "cta" });

  return (
    <CTASection
      title={t("ctaTitle")}
      description={t("ctaSubtitle")}
      primaryAction={{ label: tCta("getInTouch"), href: "/contact" }}
      secondaryAction={{ label: tCta("viewProjects"), href: "/projects" }}
      className="bg-navy"
      imageUrl={imageUrl}
      align="start"
    />
  );
}

export { CTASection } from "@/components/public/sections/CTASection";
export type { CTAAction } from "@/components/public/sections/CTASection";
