import { defineRouting } from "next-intl/routing";

import { defaultLocale, locales } from "@/lib/i18n/config";

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale,
  localePrefix: "always",
  /**
   * Arabic-first site: unprefixed "/" must always resolve to defaultLocale ("ar").
   * Browser Accept-Language / NEXT_LOCALE must not send "/" → "/en".
   * Prefixed "/ar" and "/en" routes remain fully available.
   */
  localeDetection: false,
});
