import { prisma, type Prisma } from "@/src/domain/shared/prisma";
import { rethrowIfUniqueConflict } from "@/src/domain/shared/prisma-errors";
import {
  normalizePage,
  normalizePageSize,
  paginate,
  toSkipTake,
} from "@/src/domain/shared/query";
import type {
  ProjectCategoryCreateInput,
  ProjectCategoryUpdateInput,
} from "@/src/domain/project-category/validation";

type Db = Prisma.TransactionClient | typeof prisma;

export type ProjectCategoryListParams = {
  q?: string;
  published?: boolean;
  page?: number;
  pageSize?: number;
};

function toCreateData(
  input: ProjectCategoryCreateInput,
): Prisma.ProjectCategoryCreateInput {
  return {
    slug: input.slug,
    nameAr: input.nameAr,
    nameEn: input.nameEn,
    descriptionAr: input.descriptionAr ?? null,
    descriptionEn: input.descriptionEn ?? null,
    sortOrder: input.sortOrder,
    published: input.published,
  };
}

function toUpdateData(
  input: Omit<ProjectCategoryUpdateInput, "id">,
): Prisma.ProjectCategoryUpdateInput {
  return {
    ...(input.slug !== undefined ? { slug: input.slug } : {}),
    ...(input.nameAr !== undefined ? { nameAr: input.nameAr } : {}),
    ...(input.nameEn !== undefined ? { nameEn: input.nameEn } : {}),
    ...(input.descriptionAr !== undefined
      ? { descriptionAr: input.descriptionAr ?? null }
      : {}),
    ...(input.descriptionEn !== undefined
      ? { descriptionEn: input.descriptionEn ?? null }
      : {}),
    ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
    ...(input.published !== undefined ? { published: input.published } : {}),
  };
}

export const projectCategoryRepository = {
  async create(input: ProjectCategoryCreateInput, db: Db = prisma) {
    try {
      return await db.projectCategory.create({ data: toCreateData(input) });
    } catch (error) {
      rethrowIfUniqueConflict(
        error,
        "A project category with this slug already exists",
      );
      throw error;
    }
  },

  async update(
    id: string,
    input: Omit<ProjectCategoryUpdateInput, "id">,
    db: Db = prisma,
  ) {
    try {
      return await db.projectCategory.update({
        where: { id },
        data: toUpdateData(input),
      });
    } catch (error) {
      rethrowIfUniqueConflict(
        error,
        "A project category with this slug already exists",
      );
      throw error;
    }
  },

  async findById(id: string, db: Db = prisma) {
    return db.projectCategory.findUnique({ where: { id } });
  },

  async list(params: ProjectCategoryListParams = {}) {
    const page = normalizePage(params.page);
    const pageSize = normalizePageSize(params.pageSize);
    const { skip, take } = toSkipTake(page, pageSize);
    const q = params.q?.trim() ?? "";

    const where: Prisma.ProjectCategoryWhereInput = {
      archivedAt: null,
      ...(params.published !== undefined ? { published: params.published } : {}),
      ...(q
        ? {
            OR: [
              { nameEn: { contains: q, mode: "insensitive" as const } },
              { nameAr: { contains: q, mode: "insensitive" as const } },
              { slug: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [total, items] = await Promise.all([
      prisma.projectCategory.count({ where }),
      prisma.projectCategory.findMany({
        where,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        skip,
        take,
      }),
    ]);

    return paginate(items, total, page, pageSize);
  },

  async listOptions(db: Db = prisma) {
    return db.projectCategory.findMany({
      where: { archivedAt: null },
      orderBy: { sortOrder: "asc" },
      select: { id: true, nameEn: true, nameAr: true, slug: true },
    });
  },

  async archive(id: string, db: Db = prisma) {
    return db.projectCategory.update({
      where: { id },
      data: { archivedAt: new Date(), published: false },
    });
  },
};
