import { getTranslations } from "next-intl/server";

import type { Locale } from "@/lib/i18n/config";

type AboutCertificationsProps = {
  locale: Locale;
};

/**
 * Certifications are CMS-ready. With no certification records yet,
 * hide the block instead of reserving empty dashed space.
 */
export async function AboutCertifications({
  locale,
}: AboutCertificationsProps) {
  await getTranslations({ locale, namespace: "about" });
  return null;
}
