import { prisma, type Prisma } from "@/src/domain/shared/prisma";
import {
  normalizePage,
  normalizePageSize,
  paginate,
  toSkipTake,
} from "@/src/domain/shared/query";

export type AuditLogCreateData = {
  userId?: string | null;
  action: string;
  entity?: string | null;
  entityId?: string | null;
  metadata?: Prisma.InputJsonValue;
};

export type AuditLogListFilters = {
  q?: string;
  action?: string;
  entity?: string;
  page?: number;
  pageSize?: number;
  /** @deprecated use page/pageSize */
  skip?: number;
  take?: number;
};

function buildWhere(filters: AuditLogListFilters): Prisma.AuditLogWhereInput {
  const q = filters.q?.trim() ?? "";
  const action = filters.action?.trim() ?? "";
  const entity = filters.entity?.trim() ?? "";

  return {
    ...(action ? { action: { contains: action, mode: "insensitive" } } : {}),
    ...(entity ? { entity: { contains: entity, mode: "insensitive" } } : {}),
    ...(q
      ? {
          OR: [
            { action: { contains: q, mode: "insensitive" } },
            { entity: { contains: q, mode: "insensitive" } },
            { entityId: { contains: q, mode: "insensitive" } },
            { user: { name: { contains: q, mode: "insensitive" } } },
            { user: { email: { contains: q, mode: "insensitive" } } },
          ],
        }
      : {}),
  };
}

export const auditRepository = {
  async create(data: AuditLogCreateData) {
    return prisma.auditLog.create({
      data: {
        userId: data.userId ?? null,
        action: data.action,
        entity: data.entity ?? null,
        entityId: data.entityId ?? null,
        metadata: data.metadata,
      },
    });
  },

  async listRecent(take = 10) {
    return prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take,
      include: {
        user: { select: { name: true, email: true } },
      },
    });
  },

  async list(filters: AuditLogListFilters = {}) {
    const where = buildWhere(filters);
    const page = normalizePage(filters.page);
    const pageSize = normalizePageSize(filters.pageSize, 30);
    const skip =
      filters.skip ?? toSkipTake(page, pageSize).skip;
    const take = filters.take ?? pageSize;

    const [total, items] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
    ]);

    return paginate(items, total, page, pageSize);
  },

  async listDistinctActions(take = 50) {
    return prisma.auditLog.findMany({
      distinct: ["action"],
      select: { action: true },
      orderBy: { action: "asc" },
      take,
    });
  },

  async listDistinctEntities(take = 50) {
    return prisma.auditLog.findMany({
      distinct: ["entity"],
      where: { entity: { not: null } },
      select: { entity: true },
      orderBy: { entity: "asc" },
      take,
    });
  },
};
