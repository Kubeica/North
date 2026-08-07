import { getTranslations } from "next-intl/server";

import { PublicButton } from "@/components/public/buttons/PublicButton";
import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { SectionTitle } from "@/components/public/layout/SectionTitle";
import { ProjectCover } from "@/components/public/media/ProjectCover";
import { Reveal } from "@/components/public/motion/Reveal";
import { ProjectMeta } from "@/components/public/ProjectMeta";
import { ProjectStatusBadge } from "@/components/public/ProjectStatusBadge";
import { Caption } from "@/components/public/typography/Caption";
import { Heading } from "@/components/public/typography/Heading";
import { Lead } from "@/components/public/typography/Lead";
import type { ProjectListItem } from "@/lib/data/projects";
import type { Locale } from "@/lib/i18n/config";
import { localized } from "@/lib/i18n/get-localized";
import { formatDate } from "@/lib/utils";

type ProjectsFeaturedShowcaseProps = {
  locale: Locale;
  project: ProjectListItem | null;
};

/** Large horizontal CMS featured project showcase. */
export async function ProjectsFeaturedShowcase({
  locale,
  project,
}: ProjectsFeaturedShowcaseProps) {
  const t = await getTranslations({ locale, namespace: "projects" });
  const tCta = await getTranslations({ locale, namespace: "cta" });

  if (!project) return null;

  const title = localized(project, locale, "title");
  const summary = localized(project, locale, "summary");
  const location = localized(project, locale, "location");
  const category = project.category
    ? localized(project.category, locale, "name")
    : null;
  const completionDate = project.completionDate
    ? formatDate(project.completionDate, "MMMM yyyy", locale)
    : null;

  return (
    <Section tone="navy" id="featured-project" padded={false}>
      <Container className="nm-section">
        <Reveal>
          <SectionTitle
            title={t("featuredShowcaseTitle")}
            description={t("featuredShowcaseSubtitle")}
            className="mb-10"
          />
        </Reveal>

        <Reveal delay={0.06}>
          <article className="grid overflow-hidden border border-border/50 bg-background/30 lg:grid-cols-12">
            <div className="group relative lg:col-span-7">
              <ProjectCover
                src={project.coverImageUrl}
                alt={title}
                fallbackLabel={title}
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="aspect-[16/10] lg:aspect-auto lg:min-h-[22rem] lg:h-full"
                priority
              />
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-8 lg:col-span-5 lg:p-10">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Caption className="tracking-[0.16em] text-gold uppercase">
                  {t("featured")}
                </Caption>
                <ProjectStatusBadge
                  status={project.status}
                  label={t(`status.${project.status}`)}
                />
              </div>

              <Heading as="h3" size="h2" className="text-balance">
                {title}
              </Heading>

              {summary ? (
                <Lead className="mt-4 max-w-xl text-base">{summary}</Lead>
              ) : null}

              <ProjectMeta
                className="mt-8"
                density="comfortable"
                items={[
                  ...(project.client?.name
                    ? [{ label: t("client"), value: project.client.name }]
                    : []),
                  ...(location
                    ? [{ label: t("location"), value: location }]
                    : []),
                  ...(category
                    ? [{ label: t("category"), value: category }]
                    : []),
                  ...(completionDate
                    ? [
                        {
                          label: t("completionDate"),
                          value: completionDate,
                        },
                      ]
                    : []),
                ]}
              />

              <div className="mt-8">
                <PublicButton href={`/projects/${project.slug}`}>
                  {tCta("learnMore")}
                </PublicButton>
              </div>
            </div>
          </article>
        </Reveal>
      </Container>
    </Section>
  );
}
