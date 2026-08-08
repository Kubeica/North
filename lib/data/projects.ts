import { unstable_cache } from "next/cache";
import type { ProjectStatus, Prisma } from "@prisma/client";

import { toIsoString, toIsoStringRequired } from "@/lib/date";
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

type ProjectListRaw = Prisma.ProjectGetPayload<{
  include: ProjectListInclude;
}>;

type ProjectDetailRaw = Prisma.ProjectGetPayload<{
  include: ProjectDetailInclude;
}>;

type ClientDto = {
  id: string;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  descriptionAr: string | null;
  descriptionEn: string | null;
  sortOrder: number;
  published: boolean;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type CategoryDto = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

type ProjectImageDto = {
  id: string;
  projectId: string;
  url: string;
  altAr: string | null;
  altEn: string | null;
  sortOrder: number;
  createdAt: string;
};

/**
 * Public project list DTO — date fields are ISO strings
 * (`unstable_cache` / Flight never guarantee Date instances).
 */
export type ProjectListItem = Omit<
  ProjectListRaw,
  | "startDate"
  | "completionDate"
  | "createdAt"
  | "updatedAt"
  | "archivedAt"
  | "client"
  | "category"
> & {
  startDate: string | null;
  completionDate: string | null;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
  client: ClientDto | null;
  category: CategoryDto | null;
};

/** Public project detail DTO with string dates. */
export type ProjectDetail = Omit<
  ProjectDetailRaw,
  | "startDate"
  | "completionDate"
  | "createdAt"
  | "updatedAt"
  | "archivedAt"
  | "client"
  | "category"
  | "images"
> & {
  startDate: string | null;
  completionDate: string | null;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
  client: ClientDto | null;
  category: CategoryDto | null;
  images: ProjectImageDto[];
};

export type ProjectFilters = {
  q?: string;
  category?: string;
  status?: ProjectStatus | string;
  location?: string;
  featured?: boolean;
  page?: number;
  pageSize?: number;
};

function serializeClient(
  client: ProjectListRaw["client"] | ProjectDetailRaw["client"],
): ClientDto | null {
  if (!client) return null;
  return {
    id: client.id,
    name: client.name,
    logoUrl: client.logoUrl,
    websiteUrl: client.websiteUrl,
    descriptionAr: client.descriptionAr,
    descriptionEn: client.descriptionEn,
    sortOrder: client.sortOrder,
    published: client.published,
    archivedAt: toIsoString(client.archivedAt),
    createdAt: toIsoStringRequired(client.createdAt),
    updatedAt: toIsoStringRequired(client.updatedAt),
  };
}

function serializeCategory(
  category: ProjectListRaw["category"] | ProjectDetailRaw["category"],
): CategoryDto | null {
  if (!category) return null;
  return {
    id: category.id,
    slug: category.slug,
    nameAr: category.nameAr,
    nameEn: category.nameEn,
    sortOrder: category.sortOrder,
    createdAt: toIsoStringRequired(category.createdAt),
    updatedAt: toIsoStringRequired(category.updatedAt),
  };
}

function serializeListItem(project: ProjectListRaw): ProjectListItem {
  return {
    ...project,
    startDate: toIsoString(project.startDate),
    completionDate: toIsoString(project.completionDate),
    createdAt: toIsoStringRequired(project.createdAt),
    updatedAt: toIsoStringRequired(project.updatedAt),
    archivedAt: toIsoString(project.archivedAt),
    client: serializeClient(project.client),
    category: serializeCategory(project.category),
  };
}

function serializeDetail(project: ProjectDetailRaw): ProjectDetail {
  return {
    ...project,
    startDate: toIsoString(project.startDate),
    completionDate: toIsoString(project.completionDate),
    createdAt: toIsoStringRequired(project.createdAt),
    updatedAt: toIsoStringRequired(project.updatedAt),
    archivedAt: toIsoString(project.archivedAt),
    client: serializeClient(project.client),
    category: serializeCategory(project.category),
    images: project.images.map((image) => ({
      id: image.id,
      projectId: image.projectId,
      url: image.url,
      altAr: image.altAr,
      altEn: image.altEn,
      sortOrder: image.sortOrder,
      createdAt: toIsoStringRequired(image.createdAt),
    })),
  };
}

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
    async () => {
      const items = await unstable_cache(
        () => projectService.listFeatured(limit),
        ["public-featured-projects", String(limit)],
        { revalidate: 60, tags: ["projects"] },
      )();
      return items.map(serializeListItem);
    },
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
      return {
        ...result,
        items: result.items.map(serializeListItem),
      };
    },
    { items: [], total: 0, page, pageSize },
  );
}

export async function getProjectBySlug(slug: string) {
  return safeQuery(
    async () => {
      const project = await unstable_cache(
        () => projectService.getPublishedBySlug(slug),
        ["public-project", slug],
        { revalidate: 60, tags: ["projects", `project:${slug}`] },
      )();
      return project ? serializeDetail(project) : null;
    },
    null as ProjectDetail | null,
  );
}

export async function getRelatedProjects(
  projectId: string,
  categoryId: string | null | undefined,
  limit = 3,
) {
  return safeQuery(
    async () => {
      const items = await unstable_cache(
        () => projectService.listRelated(projectId, categoryId, limit),
        [
          "public-related-projects",
          projectId,
          categoryId ?? "none",
          String(limit),
        ],
        { revalidate: 60, tags: ["projects"] },
      )();
      return items.map(serializeListItem);
    },
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
