import { getTranslations } from "next-intl/server";

import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { SectionTitle } from "@/components/public/layout/SectionTitle";
import { Reveal } from "@/components/public/motion/Reveal";
import { Paragraph } from "@/components/public/typography/Paragraph";
import type { Locale } from "@/lib/i18n/config";

type AboutCertificationsProps = {
  locale: Locale;
};

/**
 * Certifications placeholder — does not invent credentials.
 * Ready to accept CMS data when available.
 */
export async function AboutCertifications({
  locale,
}: AboutCertificationsProps) {
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <Section tone="surface" id="certifications" padded={false}>
      <Container className="nm-section">
        <Reveal>
          <SectionTitle
            title={t("certificationsTitle")}
            description={t("certificationsSubtitle")}
            className="mb-10"
          />
          <div
            className="flex min-h-[10rem] items-center justify-center border border-dashed border-border/70 bg-background/30 px-6 py-12 text-center"
            role="status"
          >
            <Paragraph className="max-w-md text-muted-foreground">
              {t("certificationsPlaceholder")}
            </Paragraph>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
