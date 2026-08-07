"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/components/public/theme/utils";

type SkipLinkProps = {
  className?: string;
};

/** Keyboard-accessible skip link to main content. */
export function SkipLink({ className }: SkipLinkProps) {
  const t = useTranslations("a11y");

  return (
    <a
      href="#main-content"
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[100]",
        "focus:inline-flex focus:h-11 focus:items-center focus:rounded-md focus:bg-gold focus:px-4",
        "focus:text-sm focus:font-medium focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-gold-light",
        className,
      )}
    >
      {t("skipToContent")}
    </a>
  );
}
