import { prisma, type Prisma } from "@/src/domain/shared/prisma";
import {
  normalizePage,
  normalizePageSize,
  paginate,
  toSkipTake,
} from "@/src/domain/shared/query";
import type {
  TeamMemberCreateInput,
  TeamMemberUpdateInput,
} from "@/src/domain/team/validation";

type Db = Prisma.TransactionClient | typeof prisma;

export type TeamListParams = {
  q?: string;
  published?: boolean;
  page?: number;
  pageSize?: number;
};

function toCreateData(
  input: TeamMemberCreateInput,
): Prisma.TeamMemberCreateInput {
  return {
    nameAr: input.nameAr,
    nameEn: input.nameEn,
    positionAr: input.positionAr,
    positionEn: input.positionEn,
    bioAr: input.bioAr ?? null,
    bioEn: input.bioEn ?? null,
    imageUrl: input.imageUrl ?? null,
    linkedin: input.linkedin ?? null,
    email: input.email ?? null,
    sortOrder: input.sortOrder,
    published: input.published,
    isDemo: input.isDemo,
  };
}

function toUpdateData(
  input: Omit<TeamMemberUpdateInput, "id">,
): Prisma.TeamMemberUpdateInput {
  return {
    ...(input.nameAr !== undefined ? { nameAr: input.nameAr } : {}),
    ...(input.nameEn !== undefined ? { nameEn: input.nameEn } : {}),
    ...(input.positionAr !== undefined ? { positionAr: input.positionAr } : {}),
    ...(input.positionEn !== undefined ? { positionEn: input.positionEn } : {}),
    ...(input.bioAr !== undefined ? { bioAr: input.bioAr ?? null } : {}),
    ...(input.bioEn !== undefined ? { bioEn: input.bioEn ?? null } : {}),
    ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl ?? null } : {}),
    ...(input.linkedin !== undefined ? { linkedin: input.linkedin ?? null } : {}),
    ...(input.email !== undefined ? { email: input.email ?? null } : {}),
    ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
    ...(input.published !== undefined ? { published: input.published } : {}),
    ...(input.isDemo !== undefined ? { isDemo: input.isDemo } : {}),
  };
}

export const teamRepository = {
  async create(input: TeamMemberCreateInput, db: Db = prisma) {
    return db.teamMember.create({ data: toCreateData(input) });
  },

  async update(
    id: string,
    input: Omit<TeamMemberUpdateInput, "id">,
    db: Db = prisma,
  ) {
    return db.teamMember.update({
      where: { id },
      data: toUpdateData(input),
    });
  },

  async findById(id: string, db: Db = prisma) {
    return db.teamMember.findUnique({ where: { id } });
  },

  async list(params: TeamListParams = {}) {
    const page = normalizePage(params.page);
    const pageSize = normalizePageSize(params.pageSize);
    const { skip, take } = toSkipTake(page, pageSize);
    const q = params.q?.trim() ?? "";

    const where: Prisma.TeamMemberWhereInput = {
      archivedAt: null,
      ...(params.published !== undefined ? { published: params.published } : {}),
      ...(q
        ? {
            OR: [
              { nameEn: { contains: q, mode: "insensitive" } },
              { nameAr: { contains: q, mode: "insensitive" } },
              { positionEn: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [total, items] = await Promise.all([
      prisma.teamMember.count({ where }),
      prisma.teamMember.findMany({
        where,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        skip,
        take,
      }),
    ]);

    return paginate(items, total, page, pageSize);
  },

  async archive(id: string, db: Db = prisma) {
    return db.teamMember.update({
      where: { id },
      data: { archivedAt: new Date(), published: false },
    });
  },

  async listPublished(db: Db = prisma) {
    return db.teamMember.findMany({
      where: { published: true, archivedAt: null },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  },
};
