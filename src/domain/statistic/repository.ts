import { prisma, type Prisma } from "@/src/domain/shared/prisma";
import {
  normalizePage,
  normalizePageSize,
  paginate,
  toSkipTake,
} from "@/src/domain/shared/query";
import type {
  StatisticCreateInput,
  StatisticUpdateInput,
} from "@/src/domain/statistic/validation";

type Db = Prisma.TransactionClient | typeof prisma;

export type StatisticListParams = {
  q?: string;
  published?: boolean;
  page?: number;
  pageSize?: number;
};

function toCreateData(input: StatisticCreateInput): Prisma.StatisticCreateInput {
  return {
    labelAr: input.labelAr,
    labelEn: input.labelEn,
    value: input.value,
    sortOrder: input.sortOrder,
    published: input.published,
  };
}

function toUpdateData(
  input: Omit<StatisticUpdateInput, "id">,
): Prisma.StatisticUpdateInput {
  return {
    ...(input.labelAr !== undefined ? { labelAr: input.labelAr } : {}),
    ...(input.labelEn !== undefined ? { labelEn: input.labelEn } : {}),
    ...(input.value !== undefined ? { value: input.value } : {}),
    ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
    ...(input.published !== undefined ? { published: input.published } : {}),
  };
}

export const statisticRepository = {
  async create(input: StatisticCreateInput, db: Db = prisma) {
    return db.statistic.create({ data: toCreateData(input) });
  },

  async update(
    id: string,
    input: Omit<StatisticUpdateInput, "id">,
    db: Db = prisma,
  ) {
    return db.statistic.update({
      where: { id },
      data: toUpdateData(input),
    });
  },

  async findById(id: string, db: Db = prisma) {
    return db.statistic.findUnique({ where: { id } });
  },

  async list(params: StatisticListParams = {}) {
    const page = normalizePage(params.page);
    const pageSize = normalizePageSize(params.pageSize);
    const { skip, take } = toSkipTake(page, pageSize);
    const q = params.q?.trim() ?? "";

    const where: Prisma.StatisticWhereInput = {
      archivedAt: null,
      ...(params.published !== undefined ? { published: params.published } : {}),
      ...(q
        ? {
            OR: [
              { labelEn: { contains: q, mode: "insensitive" as const } },
              { labelAr: { contains: q, mode: "insensitive" as const } },
              { value: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [total, items] = await Promise.all([
      prisma.statistic.count({ where }),
      prisma.statistic.findMany({
        where,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        skip,
        take,
      }),
    ]);

    return paginate(items, total, page, pageSize);
  },

  async listPublished(db: Db = prisma) {
    return db.statistic.findMany({
      where: { published: true, archivedAt: null },
      orderBy: { sortOrder: "asc" },
    });
  },

  async archive(id: string, db: Db = prisma) {
    return db.statistic.update({
      where: { id },
      data: { archivedAt: new Date(), published: false },
    });
  },
};
