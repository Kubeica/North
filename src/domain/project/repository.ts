import type { ProjectStatus } from "@prisma/client";

import { prisma, type Prisma } from "@/src/domain/shared/prisma";
import { rethrowIfUniqueConflict } from "@/src/domain/shared/prisma-errors";
import {
  normalizePage,
  normalizePageSize,
  paginate,
  toSkipTake,
} from "@/src/domain/shared/query";
import type { ProjectCreateInput, ProjectUpdateInput } from "@/src/domain/project/validation";

type Db = Prisma.TransactionClient | typeof prisma;

export type ProjectImageInput = {
  url: string;
  altAr?: string | null;
  altEn?: string | null;
  sortOrder?: number;
};

export type ProjectListParams = {
  q?: string;
  status?: ProjectStatus | string;
  published?: boolean;
  page?: number;
  pageSize?: number;
};

export type ProjectPublicFilters = {
  q?: string;
  category?: string;
  status?: ProjectStatus | string;
  location?: string;
  featured?: boolean;
  page?: number;
  pageSize?: number;
};

const projectListInclude = {
  client: true,
  category: true,
} satisfies Prisma.ProjectInclude;

const projectDetailInclude = {
  client: true,
  category: true,
  images: { orderBy: { sortOrder: "asc" as const } },
} satisfies Prisma.ProjectInclude;

function toCreateData(input: ProjectCreateInput): Prisma.ProjectCreateInput {
  return {
    slug: input.slug,
    titleAr: input.titleAr,
    titleEn: input.titleEn,
    summaryAr: input.summaryAr ?? null,
    summaryEn: input.summaryEn ?? null,
    descriptionAr: input.descriptionAr,
    descriptionEn: input.descriptionEn,
    locationAr: input.locationAr ?? null,
    locationEn: input.locationEn ?? null,
    coverImageUrl: input.coverImageUrl ?? null,
    status: input.status,
    startDate: input.startDate ?? null,
    completionDate: input.completionDate ?? null,
    featured: input.featured,
    published: input.published,
    seoTitleAr: input.seoTitleAr ?? null,
    seoTitleEn: input.seoTitleEn ?? null,
    seoDescriptionAr: input.seoDescriptionAr ?? null,
    seoDescriptionEn: input.seoDescriptionEn ?? null,
    scopeAr: input.scopeAr ?? null,
    scopeEn: input.scopeEn ?? null,
    isDemo: input.isDemo,
    ...(input.clientId
      ? { client: { connect: { id: input.clientId } } }
      : {}),
    ...(input.categoryId
      ? { category: { connect: { id: input.categoryId } } }
      : {}),
  };
}

function toUpdateData(
  input: Omit<ProjectUpdateInput, "id">,
): Prisma.ProjectUpdateInput {
  const data: Prisma.ProjectUpdateInput = {};

  if (input.slug !== undefined) data.slug = input.slug;
  if (input.titleAr !== undefined) data.titleAr = input.titleAr;
  if (input.titleEn !== undefined) data.titleEn = input.titleEn;
  if (input.summaryAr !== undefined) data.summaryAr = input.summaryAr ?? null;
  if (input.summaryEn !== undefined) data.summaryEn = input.summaryEn ?? null;
  if (input.descriptionAr !== undefined) data.descriptionAr = input.descriptionAr;
  if (input.descriptionEn !== undefined) data.descriptionEn = input.descriptionEn;
  if (input.locationAr !== undefined) data.locationAr = input.locationAr ?? null;
  if (input.locationEn !== undefined) data.locationEn = input.locationEn ?? null;
  if (input.coverImageUrl !== undefined) {
    data.coverImageUrl = input.coverImageUrl ?? null;
  }
  if (input.status !== undefined) data.status = input.status;
  if (input.startDate !== undefined) data.startDate = input.startDate ?? null;
  if (input.completionDate !== undefined) {
    data.completionDate = input.completionDate ?? null;
  }
  if (input.featured !== undefined) data.featured = input.featured;
  if (input.published !== undefined) data.published = input.published;
  if (input.seoTitleAr !== undefined) data.seoTitleAr = input.seoTitleAr ?? null;
  if (input.seoTitleEn !== undefined) data.seoTitleEn = input.seoTitleEn ?? null;
  if (input.seoDescriptionAr !== undefined) {
    data.seoDescriptionAr = input.seoDescriptionAr ?? null;
  }
  if (input.seoDescriptionEn !== undefined) {
    data.seoDescriptionEn = input.seoDescriptionEn ?? null;
  }
  if (input.scopeAr !== undefined) data.scopeAr = input.scopeAr ?? null;
  if (input.scopeEn !== undefined) data.scopeEn = input.scopeEn ?? null;
  if (input.isDemo !== undefined) data.isDemo = input.isDemo;

  if (input.clientId !== undefined) {
    data.client = input.clientId
      ? { connect: { id: input.clientId } }
      : { disconnect: true };
  }
  if (input.categoryId !== undefined) {
    data.category = input.categoryId
      ? { connect: { id: input.categoryId } }
      : { disconnect: true };
  }

  return data;
}

function buildPublicWhere(
  filters: ProjectPublicFilters,
): Prisma.ProjectWhereInput {
  const where: Prisma.ProjectWhereInput = {
    published: true,
    archivedAt: null,
  };

  if (filters.category) {
    where.category = { slug: filters.category, published: true };
  }

  if (
    filters.status &&
    ["PLANNED", "IN_PROGRESS", "COMPLETED", "ON_HOLD"].includes(filters.status)
  ) {
    where.status = filters.status as ProjectStatus;
  }

  if (filters.featured === true) {
    where.featured = true;
  }

  const location = filters.location?.trim();
  if (location) {
    where.AND = [
      {
        OR: [
          { locationEn: { equals: location, mode: "insensitive" } },
          { locationAr: { equals: location, mode: "insensitive" } },
        ],
      },
    ];
  }

  const q = filters.q?.trim();
  if (q) {
    where.OR = [
      { titleAr: { contains: q, mode: "insensitive" } },
      { titleEn: { contains: q, mode: "insensitive" } },
      { summaryAr: { contains: q, mode: "insensitive" } },
      { summaryEn: { contains: q, mode: "insensitive" } },
      { locationAr: { contains: q, mode: "insensitive" } },
      { locationEn: { contains: q, mode: "insensitive" } },
      { client: { name: { contains: q, mode: "insensitive" } } },
    ];
  }

  return where;
}

export const projectRepository = {
  async create(input: ProjectCreateInput, db: Db = prisma) {
    try {
      return await db.project.create({ data: toCreateData(input) });
    } catch (error) {
      rethrowIfUniqueConflict(error, "A project with this slug already exists");
    }
  },

  async update(id: string, input: Omit<ProjectUpdateInput, "id">, db: Db = prisma) {
    try {
      return await db.project.update({
        where: { id },
        data: toUpdateData(input),
      });
    } catch (error) {
      rethrowIfUniqueConflict(error, "A project with this slug already exists");
    }
  },

  async findById(id: string, db: Db = prisma) {
    return db.project.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });
  },

  async findBySlug(slug: string, db: Db = prisma) {
    return db.project.findUnique({ where: { slug } });
  },

  async findUniqueSlug(slug: string, db: Db = prisma) {
    return db.project.findUnique({
      where: { slug },
      select: { id: true, slug: true },
    });
  },

  async list(params: ProjectListParams = {}) {
    const page = normalizePage(params.page);
    const pageSize = normalizePageSize(params.pageSize);
    const { skip, take } = toSkipTake(page, pageSize);
    const q = params.q?.trim() ?? "";
    const status =
      params.status &&
      ["PLANNED", "IN_PROGRESS", "COMPLETED", "ON_HOLD"].includes(params.status)
        ? (params.status as ProjectStatus)
        : undefined;

    const where: Prisma.ProjectWhereInput = {
      archivedAt: null,
      ...(status ? { status } : {}),
      ...(params.published !== undefined ? { published: params.published } : {}),
      ...(q
        ? {
            OR: [
              { titleEn: { contains: q, mode: "insensitive" } },
              { titleAr: { contains: q, mode: "insensitive" } },
              { slug: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [total, items] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
        include: {
          client: { select: { id: true, name: true } },
          category: { select: { id: true, nameEn: true, nameAr: true } },
        },
      }),
    ]);

    return paginate(items, total, page, pageSize);
  },

  /** @deprecated Prefer list() — kept for transitional callers. */
  async listAdmin(options: {
    where?: Prisma.ProjectWhereInput;
    skip?: number;
    take?: number;
  } = {}) {
    const where = options.where ?? { archivedAt: null };
    const skip = options.skip ?? 0;
    const take = options.take ?? 50;

    const [total, items] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip,
        take,
        include: {
          client: { select: { id: true, name: true } },
          category: { select: { id: true, nameEn: true, nameAr: true } },
        },
      }),
    ]);

    return { total, items };
  },

  async listRecent(take = 5, db: Db = prisma) {
    return db.project.findMany({
      where: { archivedAt: null },
      orderBy: { createdAt: "desc" },
      take,
      include: { category: true },
    });
  },

  async listFeatured(limit = 6, db: Db = prisma) {
    return db.project.findMany({
      where: {
        published: true,
        archivedAt: null,
        featured: true,
      },
      include: projectListInclude,
      orderBy: [{ updatedAt: "desc" }],
      take: limit,
    });
  },

  async listPublished(filters: ProjectPublicFilters = {}) {
    const page = normalizePage(filters.page);
    const pageSize = Math.min(48, normalizePageSize(filters.pageSize, 9));
    const { skip, take } = toSkipTake(page, pageSize);
    const where = buildPublicWhere(filters);

    const [total, items] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        include: projectListInclude,
        orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
        skip,
        take,
      }),
    ]);

    return paginate(items, total, page, pageSize);
  },

  async findPublishedBySlug(slug: string, db: Db = prisma) {
    return db.project.findFirst({
      where: { slug, published: true, archivedAt: null },
      include: projectDetailInclude,
    });
  },

  async listRelated(
    projectId: string,
    categoryId: string | null | undefined,
    limit = 3,
    db: Db = prisma,
  ) {
    return db.project.findMany({
      where: {
        published: true,
        archivedAt: null,
        id: { not: projectId },
        ...(categoryId ? { categoryId } : {}),
      },
      include: projectListInclude,
      orderBy: { updatedAt: "desc" },
      take: limit,
    });
  },

  async listForSitemap(db: Db = prisma) {
    return db.project.findMany({
      where: { published: true, archivedAt: null },
      select: { slug: true, updatedAt: true },
    });
  },

  async listCategories(db: Db = prisma) {
    return db.projectCategory.findMany({
      where: { archivedAt: null },
      orderBy: { sortOrder: "asc" },
      select: { id: true, nameEn: true, nameAr: true, slug: true },
    });
  },

  async listPublishedCategories(db: Db = prisma) {
    return db.projectCategory.findMany({
      where: { published: true, archivedAt: null },
      orderBy: { sortOrder: "asc" },
    });
  },

  /** Distinct locations from published projects (for public filter dropdowns). */
  async listPublishedLocations(db: Db = prisma) {
    const rows = await db.project.findMany({
      where: {
        published: true,
        archivedAt: null,
        OR: [{ locationEn: { not: null } }, { locationAr: { not: null } }],
      },
      select: { locationAr: true, locationEn: true },
      orderBy: [{ locationEn: "asc" }, { locationAr: "asc" }],
    });

    const seen = new Set<string>();
    const locations: { value: string; labelAr: string; labelEn: string }[] = [];

    for (const row of rows) {
      const value = (row.locationEn || row.locationAr || "").trim();
      if (!value) continue;
      const key = value.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      locations.push({
        value,
        labelAr: (row.locationAr || row.locationEn || value).trim(),
        labelEn: (row.locationEn || row.locationAr || value).trim(),
      });
    }

    return locations;
  },

  async countActive(db: Db = prisma) {
    return db.project.count({ where: { archivedAt: null } });
  },

  async countByStatus(status: ProjectStatus, db: Db = prisma) {
    return db.project.count({
      where: { archivedAt: null, status },
    });
  },

  async count(db: Db = prisma) {
    return db.project.count();
  },

  async archive(id: string, db: Db = prisma) {
    return db.project.update({
      where: { id },
      data: { archivedAt: new Date(), published: false },
    });
  },

  async createWithImages(
    input: ProjectCreateInput & { images?: ProjectImageInput[] },
    db: Db = prisma,
  ) {
    const { images = [], ...projectInput } = input;
    try {
      return await db.project.create({
        data: {
          ...toCreateData(projectInput),
          images: images.length
            ? {
                create: images.map((img, index) => ({
                  url: img.url,
                  altAr: img.altAr ?? null,
                  altEn: img.altEn ?? null,
                  sortOrder: img.sortOrder ?? index,
                })),
              }
            : undefined,
        },
        include: { images: { orderBy: { sortOrder: "asc" } } },
      });
    } catch (error) {
      rethrowIfUniqueConflict(error, "A project with this slug already exists");
    }
  },

  async replaceGallery(projectId: string, urls: string[], db: Db = prisma) {
    await db.projectImage.deleteMany({ where: { projectId } });
    if (urls.length === 0) return;
    await db.projectImage.createMany({
      data: urls.map((url, index) => ({
        projectId,
        url,
        sortOrder: index,
      })),
    });
  },

  async countBySlugPrefix(prefix: string, db: Db = prisma) {
    return db.project.count({
      where: { slug: { startsWith: prefix } },
    });
  },
};
