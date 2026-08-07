import { getTranslations } from "next-intl/server";

import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { SectionTitle } from "@/components/public/layout/SectionTitle";
import { Reveal } from "@/components/public/motion/Reveal";
import { ProjectMeta, type ProjectMetaItem } from "@/components/public/ProjectMeta";
import type { Locale } from "@/lib/i18n/config";

type ProjectDetailKeyFactsProps = {
  locale: Locale;
  items: ProjectMetaItem[];
};

export async function ProjectDetailKeyFacts({
  locale,
  items,
}: ProjectDetailKeyFactsProps) {
  const t = await getTranslations({ locale, namespace: "projects" });
  if (items.length === 0) return null;

  return (
    <Section
      tone="surface"
      id="key-facts"
      className="border-y border-border"
      padded={false}
    >
      <Container className="nm-section">
        <Reveal>
          <SectionTitle
            title={t("detail.keyFactsTitle")}
            description={t("detail.keyFactsSubtitle")}
            className="mb-10"
          />
          <ProjectMeta
            items={items}
            density="comfortable"
            className="grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6"
          />
        </Reveal>
      </Container>
    </Section>
  );
}
