import { prisma, type Prisma } from "@/src/domain/shared/prisma";
import {
  normalizePage,
  normalizePageSize,
  paginate,
  toSkipTake,
} from "@/src/domain/shared/query";

type Db = Prisma.TransactionClient | typeof prisma;

export type MediaCreateData = {
  fileName: string;
  url: string;
  mimeType: string;
  size: number;
  altAr?: string | null;
  altEn?: string | null;
};

export type MediaListParams = {
  q?: string;
  page?: number;
  pageSize?: number;
};

export const mediaRepository = {
  async create(data: MediaCreateData, db: Db = prisma) {
    return db.media.create({
      data: {
        fileName: data.fileName,
        url: data.url,
        mimeType: data.mimeType,
        size: data.size,
        altAr: data.altAr ?? null,
        altEn: data.altEn ?? null,
      },
    });
  },

  async findById(id: string, db: Db = prisma) {
    return db.media.findUnique({ where: { id } });
  },

  async archive(id: string, db: Db = prisma) {
    return db.media.update({
      where: { id },
      data: { archivedAt: new Date() },
    });
  },

  async delete(id: string, db: Db = prisma) {
    return db.media.delete({ where: { id } });
  },

  async list(params: MediaListParams = {}) {
    const page = normalizePage(params.page);
    const pageSize = normalizePageSize(params.pageSize, 24);
    const { skip, take } = toSkipTake(page, pageSize);
    const q = params.q?.trim() ?? "";

    const where: Prisma.MediaWhereInput = {
      archivedAt: null,
      ...(q
        ? {
            OR: [
              { fileName: { contains: q, mode: "insensitive" } },
              { url: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [total, items] = await Promise.all([
      prisma.media.count({ where }),
      prisma.media.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
    ]);

    return paginate(items, total, page, pageSize);
  },
};
