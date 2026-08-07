import type { QuoteRequestStatus } from "@prisma/client";

import { prisma, type Prisma } from "@/src/domain/shared/prisma";
import {
  normalizePage,
  normalizePageSize,
  paginate,
  toSkipTake,
} from "@/src/domain/shared/query";
import type { QuoteRequestSubmitInput } from "@/src/domain/quote-request/validation";

type Db = Prisma.TransactionClient | typeof prisma;

export type QuoteRequestListParams = {
  q?: string;
  status?: QuoteRequestStatus | string;
  page?: number;
  pageSize?: number;
};

const STATUSES: QuoteRequestStatus[] = [
  "NEW",
  "IN_REVIEW",
  "CONTACTED",
  "WON",
  "LOST",
  "ARCHIVED",
];

function normalizeStatus(
  status?: string,
): QuoteRequestStatus | undefined {
  if (!status) return undefined;
  return STATUSES.includes(status as QuoteRequestStatus)
    ? (status as QuoteRequestStatus)
    : undefined;
}

export const quoteRequestRepository = {
  async findById(id: string, db: Db = prisma) {
    return db.quoteRequest.findUnique({ where: { id } });
  },

  async list(params: QuoteRequestListParams = {}) {
    const page = normalizePage(params.page);
    const pageSize = normalizePageSize(params.pageSize);
    const { skip, take } = toSkipTake(page, pageSize);
    const q = params.q?.trim() ?? "";
    const status = normalizeStatus(params.status);

    const where: Prisma.QuoteRequestWhereInput = {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { company: { contains: q, mode: "insensitive" } },
              { projectType: { contains: q, mode: "insensitive" } },
              { location: { contains: q, mode: "insensitive" } },
              { message: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [total, items] = await Promise.all([
      prisma.quoteRequest.count({ where }),
      prisma.quoteRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
    ]);

    return paginate(items, total, page, pageSize);
  },

  async listForExport(params: Omit<QuoteRequestListParams, "page" | "pageSize"> = {}) {
    const q = params.q?.trim() ?? "";
    const status = normalizeStatus(params.status);

    const where: Prisma.QuoteRequestWhereInput = {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { company: { contains: q, mode: "insensitive" } },
              { projectType: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    return prisma.quoteRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 5000,
    });
  },

  async countByStatus(db: Db = prisma) {
    const groups = await db.quoteRequest.groupBy({
      by: ["status"],
      _count: { _all: true },
    });

    const counts: Record<QuoteRequestStatus, number> = {
      NEW: 0,
      IN_REVIEW: 0,
      CONTACTED: 0,
      WON: 0,
      LOST: 0,
      ARCHIVED: 0,
    };

    for (const group of groups) {
      counts[group.status] = group._count._all;
    }

    return counts;
  },

  async countAll(db: Db = prisma) {
    return db.quoteRequest.count();
  },

  async create(
    input: Omit<QuoteRequestSubmitInput, "website"> & {
      attachmentUrl?: string | null;
    },
    db: Db = prisma,
  ) {
    return db.quoteRequest.create({
      data: {
        company: input.company,
        name: input.name,
        email: input.email,
        phone: input.phone ?? null,
        projectType: input.projectType,
        budget: input.budget ?? null,
        location: input.location ?? null,
        timeline: input.timeline ?? null,
        message: input.message,
        attachmentUrl: input.attachmentUrl ?? null,
        status: "NEW",
      },
    });
  },

  async updateStatus(id: string, status: QuoteRequestStatus, db: Db = prisma) {
    return db.quoteRequest.update({
      where: { id },
      data: { status },
    });
  },

  async updateNotes(id: string, notes: string | null, db: Db = prisma) {
    return db.quoteRequest.update({
      where: { id },
      data: { notes },
    });
  },

  async delete(id: string, db: Db = prisma) {
    return db.quoteRequest.delete({ where: { id } });
  },
};
