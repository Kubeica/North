import { getTranslations } from "next-intl/server";

import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { Reveal } from "@/components/public/motion/Reveal";
import { Caption } from "@/components/public/typography/Caption";
import { Heading } from "@/components/public/typography/Heading";
import { Lead } from "@/components/public/typography/Lead";
import { Paragraph } from "@/components/public/typography/Paragraph";
import type { Locale } from "@/lib/i18n/config";

type ProjectDetailOverviewProps = {
  locale: Locale;
  summary?: string | null;
  description: string;
  scope?: string | null;
};

export async function ProjectDetailOverview({
  locale,
  summary,
  description,
  scope,
}: ProjectDetailOverviewProps) {
  const t = await getTranslations({ locale, namespace: "projects" });

  return (
    <Section tone="dark" id="overview" padded={false}>
      <Container className="nm-section">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <Caption className="tracking-[0.2em] text-gold uppercase">
              {t("detail.overviewEyebrow")}
            </Caption>
            <Heading as="h2" size="h2" className="mt-4 text-balance">
              {t("detail.overviewTitle")}
            </Heading>
            {summary ? <Lead className="mt-5 max-w-2xl">{summary}</Lead> : null}
            <Paragraph className="mt-6 whitespace-pre-line text-muted-foreground">
              {description}
            </Paragraph>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={0.08}>
            <div className="border border-border/60 bg-surface/30 p-6 sm:p-8">
              <Caption className="tracking-[0.14em] text-gold uppercase">
                {t("detail.engineeringSummary")}
              </Caption>
              {scope ? (
                <Paragraph className="mt-4 whitespace-pre-line text-sm text-muted-foreground">
                  {scope}
                </Paragraph>
              ) : (
                <Paragraph className="mt-4 text-sm text-muted-foreground">
                  {t("detail.engineeringSummaryFallback")}
                </Paragraph>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
