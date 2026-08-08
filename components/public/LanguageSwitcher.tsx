"use client";

import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/components/public/theme/utils";
import { Link, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/lib/i18n/config";

type LanguageSwitcherProps = {
  className?: string;
};

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const otherLocale: Locale = locale === "ar" ? "en" : "ar";
  const switchLabel =
    otherLocale === "ar" ? t("switchToArabic") : t("switchToEnglish");

  return (
    <Link
      href={pathname}
      locale={otherLocale}
      className={cn(
        "rounded-sm px-2 py-1.5 text-xs font-medium tracking-wide text-muted-foreground transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
        className,
      )}
      aria-label={switchLabel}
      hrefLang={otherLocale}
      lang={otherLocale}
    >
      <span aria-hidden className="inline-flex items-center">
        <span className={locale === "ar" ? "text-gold" : undefined}>AR</span>
        <span className="mx-1 text-border">|</span>
        <span className={locale === "en" ? "text-gold" : undefined}>EN</span>
      </span>
    </Link>
  );
}
