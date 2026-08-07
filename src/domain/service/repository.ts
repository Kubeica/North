import { prisma, type Prisma } from "@/src/domain/shared/prisma";
import { rethrowIfUniqueConflict } from "@/src/domain/shared/prisma-errors";
import {
  normalizePage,
  normalizePageSize,
  paginate,
  toSkipTake,
} from "@/src/domain/shared/query";
import type {
  ServiceCreateInput,
  ServiceUpdateInput,
} from "@/src/domain/service/validation";

type Db = Prisma.TransactionClient | typeof prisma;

export type ServiceListParams = {
  q?: string;
  published?: boolean;
  page?: number;
  pageSize?: number;
};

function toCreateData(input: ServiceCreateInput): Prisma.ServiceCreateInput {
  return {
    slug: input.slug,
    nameAr: input.nameAr,
    nameEn: input.nameEn,
    descriptionAr: input.descriptionAr,
    descriptionEn: input.descriptionEn,
    icon: input.icon ?? null,
    imageUrl: input.imageUrl ?? null,
    sortOrder: input.sortOrder,
    published: input.published,
    isDemo: input.isDemo,
  };
}

function toUpdateData(
  input: Omit<ServiceUpdateInput, "id">,
): Prisma.ServiceUpdateInput {
  return {
    ...(input.slug !== undefined ? { slug: input.slug } : {}),
    ...(input.nameAr !== undefined ? { nameAr: input.nameAr } : {}),
    ...(input.nameEn !== undefined ? { nameEn: input.nameEn } : {}),
    ...(input.descriptionAr !== undefined
      ? { descriptionAr: input.descriptionAr }
      : {}),
    ...(input.descriptionEn !== undefined
      ? { descriptionEn: input.descriptionEn }
      : {}),
    ...(input.icon !== undefined ? { icon: input.icon ?? null } : {}),
    ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl ?? null } : {}),
    ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
    ...(input.published !== undefined ? { published: input.published } : {}),
    ...(input.isDemo !== undefined ? { isDemo: input.isDemo } : {}),
  };
}

export const serviceRepository = {
  async create(input: ServiceCreateInput, db: Db = prisma) {
    try {
      return await db.service.create({ data: toCreateData(input) });
    } catch (error) {
      rethrowIfUniqueConflict(error, "A service with this slug already exists");
    }
  },

  async update(id: string, input: Omit<ServiceUpdateInput, "id">, db: Db = prisma) {
    try {
      return await db.service.update({
        where: { id },
        data: toUpdateData(input),
      });
    } catch (error) {
      rethrowIfUniqueConflict(error, "A service with this slug already exists");
    }
  },

  async findById(id: string, db: Db = prisma) {
    return db.service.findUnique({ where: { id } });
  },

  async list(params: ServiceListParams = {}) {
    const page = normalizePage(params.page);
    const pageSize = normalizePageSize(params.pageSize);
    const { skip, take } = toSkipTake(page, pageSize);
    const q = params.q?.trim() ?? "";

    const where: Prisma.ServiceWhereInput = {
      archivedAt: null,
      ...(params.published !== undefined ? { published: params.published } : {}),
      ...(q
        ? {
            OR: [
              { nameEn: { contains: q, mode: "insensitive" } },
              { nameAr: { contains: q, mode: "insensitive" } },
              { slug: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [total, items] = await Promise.all([
      prisma.service.count({ where }),
      prisma.service.findMany({
        where,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        skip,
        take,
      }),
    ]);

    return paginate(items, total, page, pageSize);
  },

  async listPublished(db: Db = prisma) {
    return db.service.findMany({
      where: { published: true, archivedAt: null },
      orderBy: { sortOrder: "asc" },
    });
  },

  async findPublishedBySlug(slug: string, db: Db = prisma) {
    return db.service.findFirst({
      where: { slug, published: true, archivedAt: null },
    });
  },

  async listForSitemap(db: Db = prisma) {
    return db.service.findMany({
      where: { published: true, archivedAt: null },
      select: { slug: true, updatedAt: true },
    });
  },

  async countActive(db: Db = prisma) {
    return db.service.count({ where: { archivedAt: null } });
  },

  async archive(id: string, db: Db = prisma) {
    return db.service.update({
      where: { id },
      data: { archivedAt: new Date(), published: false },
    });
  },
};
