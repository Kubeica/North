import { getTranslations } from "next-intl/server";

import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { SectionTitle } from "@/components/public/layout/SectionTitle";
import { Reveal } from "@/components/public/motion/Reveal";
import { Timeline } from "@/components/public/Timeline";
import { Paragraph } from "@/components/public/typography/Paragraph";
import type { Locale } from "@/lib/i18n/config";

type ProjectDetailScopeProps = {
  locale: Locale;
  scope?: string | null;
};

function parseScopeItems(scope: string): string[] {
  return scope
    .split(/\n|•|;|,/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

export async function ProjectDetailScope({
  locale,
  scope,
}: ProjectDetailScopeProps) {
  const t = await getTranslations({ locale, namespace: "projects" });
  const items = scope ? parseScopeItems(scope) : [];

  return (
    <Section tone="dark" id="scope" padded={false}>
      <Container className="nm-section">
        <Reveal>
          <SectionTitle
            title={t("scope")}
            description={t("detail.scopeSubtitle")}
            className="mb-10"
          />
        </Reveal>

        {items.length > 0 ? (
          <Timeline
            steps={items.map((item) => ({ title: item }))}
            className="lg:grid-cols-3"
            numbered
          />
        ) : (
          <div
            className="flex min-h-[8rem] items-center justify-center border border-dashed border-border/70 bg-surface/20 px-6 py-10 text-center"
            role="status"
          >
            <Paragraph className="max-w-md text-muted-foreground">
              {t("detail.scopePlaceholder")}
            </Paragraph>
          </div>
        )}
      </Container>
    </Section>
  );
}
