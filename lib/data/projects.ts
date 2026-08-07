import { unstable_cache } from "next/cache";
import type { ProjectStatus, Prisma } from "@prisma/client";

import { safeQuery } from "@/lib/data/safe";
import { projectService } from "@/src/domain/project/service";
import type { PaginatedResult } from "@/types";

type ProjectListInclude = {
  client: true;
  category: true;
};

type ProjectDetailInclude = {
  client: true;
  category: true;
  images: { orderBy: { sortOrder: "asc" } };
};

export type ProjectListItem = Prisma.ProjectGetPayload<{
  include: ProjectListInclude;
}>;

export type ProjectDetail = Prisma.ProjectGetPayload<{
  include: ProjectDetailInclude;
}>;

export type ProjectFilters = {
  q?: string;
  category?: string;
  status?: ProjectStatus | string;
  location?: string;
  featured?: boolean;
  page?: number;
  pageSize?: number;
};

function cacheKeyForFilters(filters: ProjectFilters): string {
  return JSON.stringify({
    q: filters.q?.trim() || "",
    category: filters.category || "",
    status: filters.status || "",
    location: filters.location || "",
    featured: filters.featured === true,
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? 9,
  });
}

export async function getFeaturedProjects(limit = 6) {
  return safeQuery(
    () =>
      unstable_cache(
        () => projectService.listFeatured(limit),
        ["public-featured-projects", String(limit)],
        { revalidate: 60, tags: ["projects"] },
      )(),
    [] as ProjectListItem[],
  );
}

export async function getProjects(
  filters: ProjectFilters = {},
): Promise<PaginatedResult<ProjectListItem>> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(48, Math.max(1, filters.pageSize ?? 9));
  const normalized: ProjectFilters = {
    ...filters,
    page,
    pageSize,
  };

  return safeQuery(
    async () => {
      const result = await unstable_cache(
        () =>
          projectService.listPublished({
            ...normalized,
            page,
            pageSize,
          }),
        ["public-projects", cacheKeyForFilters(normalized)],
        { revalidate: 60, tags: ["projects"] },
      )();
      return result as PaginatedResult<ProjectListItem>;
    },
    { items: [], total: 0, page, pageSize },
  );
}

export async function getProjectBySlug(slug: string) {
  return safeQuery(
    () =>
      unstable_cache(
        () => projectService.getPublishedBySlug(slug),
        ["public-project", slug],
        { revalidate: 60, tags: ["projects", `project:${slug}`] },
      )(),
    null,
  ) as Promise<ProjectDetail | null>;
}

export async function getRelatedProjects(
  projectId: string,
  categoryId: string | null | undefined,
  limit = 3,
) {
  return safeQuery(
    () =>
      unstable_cache(
        () => projectService.listRelated(projectId, categoryId, limit),
        [
          "public-related-projects",
          projectId,
          categoryId ?? "none",
          String(limit),
        ],
        { revalidate: 60, tags: ["projects"] },
      )(),
    [] as ProjectListItem[],
  );
}

export async function getProjectCategories() {
  return safeQuery(
    () =>
      unstable_cache(
        () => projectService.listPublishedCategories(),
        ["public-project-categories"],
        { revalidate: 60, tags: ["projects"] },
      )(),
    [],
  );
}

export async function getProjectLocations() {
  return safeQuery(
    () =>
      unstable_cache(
        () => projectService.listPublishedLocations(),
        ["public-project-locations"],
        { revalidate: 60, tags: ["projects"] },
      )(),
    [],
  );
}
