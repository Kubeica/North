import { getTranslations } from "next-intl/server";
import type { ComponentProps } from "react";

import { ProjectCover } from "@/components/public/media/ProjectCover";
import {
  ProjectMeta,
  type ProjectMetaItem,
} from "@/components/public/ProjectMeta";
import { ProjectStatusBadge } from "@/components/public/ProjectStatusBadge";
import { Caption } from "@/components/public/typography/Caption";
import { Heading } from "@/components/public/typography/Heading";
import { cn } from "@/components/public/theme/utils";
import { Link } from "@/i18n/navigation";
import type { ProjectListItem } from "@/lib/data/projects";
import type { Locale } from "@/lib/i18n/config";
import { localized } from "@/lib/i18n/get-localized";
import { formatDate } from "@/lib/utils";

type ProjectCardProps = {
  locale: Locale;
  project: ProjectListItem;
  className?: string;
};

/** Presentational project card surface (no data fetching). */
export function ProjectCardSurface({
  href,
  title,
  summary,
  status,
  statusLabel,
  featuredLabel,
  featured,
  coverImageUrl,
  meta,
  className,
}: {
  href: string;
  title: string;
  summary?: string | null;
  status?: string;
  statusLabel?: string | null;
  featuredLabel?: string;
  featured?: boolean;
  coverImageUrl?: string | null;
  meta?: ProjectMetaItem[];
  className?: string;
}) {
  return (
    <Link
      href={href as ComponentProps<typeof Link>["href"]}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden border border-border/50 bg-surface/20",
        "transition-[border-color,background-color] duration-300",
        "hover:border-gold/40 hover:bg-surface/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
        className,
      )}
    >
      <ProjectCover
        src={coverImageUrl}
        alt={title}
        fallbackLabel={title}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="aspect-[16/11]"
      />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {status && statusLabel ? (
            <ProjectStatusBadge status={status} label={statusLabel} />
          ) : null}
          {featured && featuredLabel ? (
            <Caption className="tracking-[0.12em] text-gold uppercase">
              {featuredLabel}
            </Caption>
          ) : null}
        </div>

        <Heading
          as="h3"
          size="h4"
          className="text-foreground transition-colors group-hover:text-gold"
        >
          {title}
        </Heading>

        {summary ? (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {summary}
          </p>
        ) : null}

        {meta && meta.length > 0 ? (
          <ProjectMeta className="mt-4" items={meta} />
        ) : null}
      </div>
    </Link>
  );
}

export async function ProjectCard({
  locale,
  project,
  className,
}: ProjectCardProps) {
  const t = await getTranslations({ locale, namespace: "projects" });
  const title = localized(project, locale, "title");
  const summary = localized(project, locale, "summary");
  const location = localized(project, locale, "location");
  const category = project.category
    ? localized(project.category, locale, "name")
    : null;
  const completionDate = project.completionDate
    ? formatDate(project.completionDate, "yyyy", locale)
    : null;

  const meta: ProjectMetaItem[] = [];
  if (project.client?.name) {
    meta.push({ label: t("client"), value: project.client.name });
  }
  if (location) {
    meta.push({ label: t("location"), value: location });
  }
  if (category) {
    meta.push({ label: t("category"), value: category });
  }
  if (completionDate) {
    meta.push({ label: t("completionDate"), value: completionDate });
  }

  return (
    <ProjectCardSurface
      href={`/projects/${project.slug}`}
      title={title}
      summary={summary}
      status={project.status}
      statusLabel={t(`status.${project.status}`)}
      featuredLabel={t("featured")}
      featured={project.featured}
      coverImageUrl={project.coverImageUrl}
      meta={meta}
      className={className}
    />
  );
}
