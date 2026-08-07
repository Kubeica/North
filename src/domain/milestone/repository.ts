import { prisma, type Prisma } from "@/src/domain/shared/prisma";
import {
  normalizePage,
  normalizePageSize,
  paginate,
  toSkipTake,
} from "@/src/domain/shared/query";
import type {
  CompanyMilestoneCreateInput,
  CompanyMilestoneUpdateInput,
} from "@/src/domain/milestone/validation";

type Db = Prisma.TransactionClient | typeof prisma;

export type MilestoneListParams = {
  q?: string;
  published?: boolean;
  page?: number;
  pageSize?: number;
};

function toCreateData(
  input: CompanyMilestoneCreateInput,
): Prisma.CompanyMilestoneCreateInput {
  return {
    year: input.year,
    titleAr: input.titleAr,
    titleEn: input.titleEn,
    descriptionAr: input.descriptionAr ?? null,
    descriptionEn: input.descriptionEn ?? null,
    sortOrder: input.sortOrder,
    published: input.published,
  };
}

function toUpdateData(
  input: Omit<CompanyMilestoneUpdateInput, "id">,
): Prisma.CompanyMilestoneUpdateInput {
  return {
    ...(input.year !== undefined ? { year: input.year } : {}),
    ...(input.titleAr !== undefined ? { titleAr: input.titleAr } : {}),
    ...(input.titleEn !== undefined ? { titleEn: input.titleEn } : {}),
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

export const milestoneRepository = {
  async create(input: CompanyMilestoneCreateInput, db: Db = prisma) {
    return db.companyMilestone.create({ data: toCreateData(input) });
  },

  async update(
    id: string,
    input: Omit<CompanyMilestoneUpdateInput, "id">,
    db: Db = prisma,
  ) {
    return db.companyMilestone.update({
      where: { id },
      data: toUpdateData(input),
    });
  },

  async findById(id: string, db: Db = prisma) {
    return db.companyMilestone.findUnique({ where: { id } });
  },

  async list(params: MilestoneListParams = {}) {
    const page = normalizePage(params.page);
    const pageSize = normalizePageSize(params.pageSize);
    const { skip, take } = toSkipTake(page, pageSize);
    const q = params.q?.trim() ?? "";

    const where: Prisma.CompanyMilestoneWhereInput = {
      ...(params.published !== undefined ? { published: params.published } : {}),
      ...(q
        ? {
            OR: [
              { titleEn: { contains: q, mode: "insensitive" } },
              { titleAr: { contains: q, mode: "insensitive" } },
              { descriptionEn: { contains: q, mode: "insensitive" } },
              { descriptionAr: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [total, items] = await Promise.all([
      prisma.companyMilestone.count({ where }),
      prisma.companyMilestone.findMany({
        where,
        orderBy: [{ sortOrder: "asc" }, { year: "asc" }, { createdAt: "desc" }],
        skip,
        take,
      }),
    ]);

    return paginate(items, total, page, pageSize);
  },

  async delete(id: string, db: Db = prisma) {
    return db.companyMilestone.delete({ where: { id } });
  },

  async listPublished(db: Db = prisma) {
    return db.companyMilestone.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { year: "asc" }],
    });
  },
};
