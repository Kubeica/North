import { ArrowUpLeft, ArrowUpRight } from "lucide-react";
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
  /** Overlay portfolio style (home featured) vs classic stacked card. */
  variant?: "portfolio" | "classic";
  /** Visually larger portfolio tile for featured showcase slots. */
  size?: "default" | "featured";
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
  locationLabel,
  locale,
  className,
  variant = "portfolio",
  size = "default",
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
  locationLabel?: string | null;
  locale?: string;
  className?: string;
  variant?: "portfolio" | "classic";
  size?: "default" | "featured";
}) {
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowUpLeft : ArrowUpRight;
  const isFeaturedSize = size === "featured";

  if (variant === "classic") {
    return (
      <Link
        href={href as ComponentProps<typeof Link>["href"]}
        className={cn(
          "group relative flex h-full flex-col overflow-hidden bg-surface/25",
          "ring-1 ring-border/40 transition-[ring-color,background-color] duration-300",
          "hover:bg-surface/45 hover:ring-gold/35",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
          className,
        )}
      >
        <ProjectCover
          src={coverImageUrl}
          alt={title}
          seed={href}
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

  return (
    <Link
      href={href as ComponentProps<typeof Link>["href"]}
      className={cn(
        "group relative block h-full overflow-hidden bg-surface",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
        className,
      )}
    >
      <ProjectCover
        src={coverImageUrl}
        alt={title}
        seed={href}
        sizes={
          isFeaturedSize
            ? "(max-width: 768px) 100vw, 70vw"
            : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        }
        className={cn(
          "h-full w-full",
          isFeaturedSize
            ? "aspect-[16/10] sm:aspect-[16/9]"
            : "aspect-[4/5] sm:aspect-[3/4]",
        )}
      />
      <div
        aria-hidden
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background:
            "linear-gradient(to top, rgba(5, 10, 15, 0.78) 0%, rgba(5, 10, 15, 0.32) 42%, rgba(5, 10, 15, 0.06) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[rgba(5,10,15,0)] transition-colors duration-500 group-hover:bg-[rgba(5,10,15,0.14)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px origin-start scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100"
      />

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 flex items-end justify-between gap-4",
          isFeaturedSize ? "p-6 md:p-8" : "p-5 md:p-6",
        )}
      >
        <div className="min-w-0">
          {status && statusLabel ? (
            <Caption className="mb-2 tracking-[0.14em] text-gold/90 uppercase">
              {statusLabel}
            </Caption>
          ) : null}
          <Heading
            as="h3"
            size={isFeaturedSize ? "h3" : "h4"}
            className="text-balance text-foreground transition-colors group-hover:text-gold"
          >
            {title}
          </Heading>
          {locationLabel ? (
            <p className="mt-1.5 text-sm text-muted-foreground/90">
              {locationLabel}
            </p>
          ) : null}
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center border border-gold/45 text-gold opacity-80 transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-background group-hover:opacity-100">
          <Arrow className="size-4" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export async function ProjectCard({
  locale,
  project,
  className,
  variant = "portfolio",
  size = "default",
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
      locationLabel={location}
      locale={locale}
      className={className}
      variant={variant}
      size={size}
    />
  );
}
