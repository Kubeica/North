import { prisma, type Prisma } from "@/src/domain/shared/prisma";
import {
  normalizePage,
  normalizePageSize,
  paginate,
  toSkipTake,
} from "@/src/domain/shared/query";
import type {
  ClientCreateInput,
  ClientUpdateInput,
} from "@/src/domain/client/validation";

type Db = Prisma.TransactionClient | typeof prisma;

export type ClientListParams = {
  q?: string;
  published?: boolean;
  page?: number;
  pageSize?: number;
};

function toCreateData(input: ClientCreateInput): Prisma.ClientCreateInput {
  return {
    name: input.name,
    logoUrl: input.logoUrl ?? null,
    websiteUrl: input.websiteUrl ?? null,
    descriptionAr: input.descriptionAr ?? null,
    descriptionEn: input.descriptionEn ?? null,
    sortOrder: input.sortOrder,
    published: input.published,
  };
}

function toUpdateData(
  input: Omit<ClientUpdateInput, "id">,
): Prisma.ClientUpdateInput {
  return {
    ...(input.name !== undefined ? { name: input.name } : {}),
    ...(input.logoUrl !== undefined ? { logoUrl: input.logoUrl ?? null } : {}),
    ...(input.websiteUrl !== undefined
      ? { websiteUrl: input.websiteUrl ?? null }
      : {}),
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

export const clientRepository = {
  async create(input: ClientCreateInput, db: Db = prisma) {
    return db.client.create({ data: toCreateData(input) });
  },

  async update(id: string, input: Omit<ClientUpdateInput, "id">, db: Db = prisma) {
    return db.client.update({
      where: { id },
      data: toUpdateData(input),
    });
  },

  async findById(id: string, db: Db = prisma) {
    return db.client.findUnique({ where: { id } });
  },

  async list(params: ClientListParams = {}) {
    const page = normalizePage(params.page);
    const pageSize = normalizePageSize(params.pageSize);
    const { skip, take } = toSkipTake(page, pageSize);
    const q = params.q?.trim() ?? "";

    const where: Prisma.ClientWhereInput = {
      archivedAt: null,
      ...(params.published !== undefined ? { published: params.published } : {}),
      ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
    };

    const [total, items] = await Promise.all([
      prisma.client.count({ where }),
      prisma.client.findMany({
        where,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        skip,
        take,
      }),
    ]);

    return paginate(items, total, page, pageSize);
  },

  async listPublished(db: Db = prisma) {
    return db.client.findMany({
      where: { published: true, archivedAt: null },
      orderBy: { sortOrder: "asc" },
    });
  },

  async listOptions(db: Db = prisma) {
    return db.client.findMany({
      where: { archivedAt: null },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true },
    });
  },

  async countActive(db: Db = prisma) {
    return db.client.count({ where: { archivedAt: null } });
  },

  async archive(id: string, db: Db = prisma) {
    return db.client.update({
      where: { id },
      data: { archivedAt: new Date(), published: false },
    });
  },
};
