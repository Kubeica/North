import { getTranslations } from "next-intl/server";

import { PublicButton } from "@/components/public/buttons/PublicButton";
import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { SectionTitle } from "@/components/public/layout/SectionTitle";
import { Reveal } from "@/components/public/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/public/motion/Stagger";
import { ProjectCard } from "@/components/public/ProjectCard";
import type { ProjectListItem } from "@/lib/data/projects";
import type { Locale } from "@/lib/i18n/config";

type FeaturedProjectsProps = {
  locale: Locale;
  projects: ProjectListItem[];
};

export async function FeaturedProjects({
  locale,
  projects,
}: FeaturedProjectsProps) {
  const t = await getTranslations({ locale, namespace: "home" });
  const tCta = await getTranslations({ locale, namespace: "cta" });

  if (projects.length === 0) return null;

  return (
    <Section
      tone="surface"
      id="projects"
      className="border-y border-border"
      padded={false}
    >
      <Container className="nm-section">
        <Reveal>
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionTitle
              title={t("featuredProjects")}
              description={t("featuredProjectsSubtitle")}
              className="mb-0"
            />
            <PublicButton href="/projects" variant="link">
              {tCta("viewAll")}
            </PublicButton>
          </div>
        </Reveal>

        <Stagger className="nm-grid-projects">
          {projects.map((project) => (
            <StaggerItem key={project.id}>
              <ProjectCard locale={locale} project={project} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
