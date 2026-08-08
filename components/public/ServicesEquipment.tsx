import { getTranslations } from "next-intl/server";

import type { Locale } from "@/lib/i18n/config";

type ServicesEquipmentProps = {
  locale: Locale;
};

/**
 * Equipment section is CMS-ready. With no equipment records yet,
 * hide the block entirely instead of reserving empty space.
 */
export async function ServicesEquipment({ locale }: ServicesEquipmentProps) {
  // Keep the translation call so the locale stays wired for future CMS data.
  await getTranslations({ locale, namespace: "services" });
  return null;
}
