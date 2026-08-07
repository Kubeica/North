"use client";

import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type LanguageTabsRenderProps = {
  lang: "ar" | "en";
};

type LanguageTabsProps = {
  defaultValue?: "ar" | "en";
  arabic?: ReactNode;
  english?: ReactNode;
  children?: (props: LanguageTabsRenderProps) => ReactNode;
  className?: string;
};

/**
 * AR | EN tabs for bilingual admin forms.
 *
 * Both panels stay mounted (CSS-hidden) so native form fields in the
 * inactive language are still included on submit.
 */
export function LanguageTabs({
  defaultValue = "en",
  arabic,
  english,
  children,
  className,
}: LanguageTabsProps) {
  const [lang, setLang] = useState<"ar" | "en">(defaultValue);

  const enContent = children ? children({ lang: "en" }) : english;
  const arContent = children ? children({ lang: "ar" }) : arabic;

  return (
    <div className={cn("w-full", className)}>
      <div
        role="tablist"
        aria-label="Content language"
        className="mb-3 inline-flex h-8 items-center gap-1 rounded-none border-b border-border"
      >
        <button
          type="button"
          role="tab"
          aria-selected={lang === "en"}
          id="lang-tab-en"
          aria-controls="lang-panel-en"
          onClick={() => setLang("en")}
          className={cn(
            "relative px-3 py-1.5 text-sm font-medium transition-colors",
            lang === "en"
              ? "text-gold after:absolute after:inset-x-0 after:bottom-[-1px] after:h-0.5 after:bg-gold"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          EN
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={lang === "ar"}
          id="lang-tab-ar"
          aria-controls="lang-panel-ar"
          onClick={() => setLang("ar")}
          className={cn(
            "relative px-3 py-1.5 text-sm font-medium transition-colors",
            lang === "ar"
              ? "text-gold after:absolute after:inset-x-0 after:bottom-[-1px] after:h-0.5 after:bg-gold"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          AR
        </button>
      </div>

      <div
        role="tabpanel"
        id="lang-panel-en"
        aria-labelledby="lang-tab-en"
        hidden={lang !== "en"}
        className="outline-none"
      >
        {enContent}
      </div>
      <div
        role="tabpanel"
        id="lang-panel-ar"
        aria-labelledby="lang-tab-ar"
        hidden={lang !== "ar"}
        dir="rtl"
        className="outline-none"
      >
        {arContent}
      </div>
    </div>
  );
}
