import { getTranslations } from "next-intl/server";

import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { SectionTitle } from "@/components/public/layout/SectionTitle";
import { Reveal } from "@/components/public/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/public/motion/Stagger";
import { ProjectCard } from "@/components/public/ProjectCard";
import { ProjectGrid } from "@/components/public/ProjectGrid";
import type { ProjectListItem } from "@/lib/data/projects";
import type { Locale } from "@/lib/i18n/config";

type ProjectDetailRelatedProps = {
  locale: Locale;
  projects: ProjectListItem[];
};

export async function ProjectDetailRelated({
  locale,
  projects,
}: ProjectDetailRelatedProps) {
  const t = await getTranslations({ locale, namespace: "projects" });
  if (projects.length === 0) return null;

  return (
    <Section tone="dark" id="related" padded={false}>
      <Container className="nm-section">
        <Reveal>
          <SectionTitle
            title={t("related")}
            description={t("detail.relatedSubtitle")}
            className="mb-10"
          />
        </Reveal>
        <Stagger>
          <ProjectGrid>
            {projects.map((project) => (
              <StaggerItem key={project.id}>
                <ProjectCard locale={locale} project={project} />
              </StaggerItem>
            ))}
          </ProjectGrid>
        </Stagger>
      </Container>
    </Section>
  );
}
