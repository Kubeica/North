import { getTranslations } from "next-intl/server";

import { PublicButton } from "@/components/public/buttons/PublicButton";
import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { Reveal } from "@/components/public/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/public/motion/Stagger";
import { ProjectCard } from "@/components/public/ProjectCard";
import { Heading } from "@/components/public/typography/Heading";
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

  const showcase = projects.slice(0, 3);
  const [lead, ...rest] = showcase;

  return (
    <Section tone="dark" id="projects" padded={false}>
      <Container className="nm-section">
        <Reveal>
          <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <Heading as="h2" size="h2" className="max-w-[18ch] text-balance">
              {t("featuredProjects")}
            </Heading>
            <PublicButton href="/projects" variant="link" className="shrink-0">
              {tCta("viewAll")}
            </PublicButton>
          </div>
        </Reveal>

        <Stagger className="grid gap-3 sm:gap-4">
          {lead ? (
            <StaggerItem>
              <ProjectCard
                locale={locale}
                project={lead}
                variant="portfolio"
                size="featured"
              />
            </StaggerItem>
          ) : null}

          {rest.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {rest.map((project) => (
                <StaggerItem key={project.id}>
                  <ProjectCard
                    locale={locale}
                    project={project}
                    variant="portfolio"
                    size="default"
                  />
                </StaggerItem>
              ))}
            </div>
          ) : null}
        </Stagger>
      </Container>
    </Section>
  );
}
