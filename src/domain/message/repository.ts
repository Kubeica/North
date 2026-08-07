import type { MessageStatus } from "@prisma/client";

import { prisma, type Prisma } from "@/src/domain/shared/prisma";
import {
  normalizePage,
  normalizePageSize,
  paginate,
  toSkipTake,
} from "@/src/domain/shared/query";
import type { MessageCreateInput } from "@/src/domain/message/validation";

type Db = Prisma.TransactionClient | typeof prisma;

export type MessageListParams = {
  q?: string;
  status?: MessageStatus | string;
  page?: number;
  pageSize?: number;
};

export const messageRepository = {
  async findById(id: string, db: Db = prisma) {
    return db.contactMessage.findUnique({ where: { id } });
  },

  async list(params: MessageListParams = {}) {
    const page = normalizePage(params.page);
    const pageSize = normalizePageSize(params.pageSize);
    const { skip, take } = toSkipTake(page, pageSize);
    const q = params.q?.trim() ?? "";
    const status =
      params.status === "UNREAD" ||
      params.status === "READ" ||
      params.status === "ARCHIVED"
        ? params.status
        : undefined;

    const where: Prisma.ContactMessageWhereInput = {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { subject: { contains: q, mode: "insensitive" } },
              { company: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [total, items] = await Promise.all([
      prisma.contactMessage.count({ where }),
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
    ]);

    return paginate(items, total, page, pageSize);
  },

  async listRecent(take = 5, db: Db = prisma) {
    return db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take,
    });
  },

  async countUnread(db: Db = prisma) {
    return db.contactMessage.count({ where: { status: "UNREAD" } });
  },

  async create(input: MessageCreateInput, db: Db = prisma) {
    return db.contactMessage.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        company: input.company,
        subject: input.subject,
        message: input.message,
      },
    });
  },

  async updateStatus(id: string, status: MessageStatus, db: Db = prisma) {
    return db.contactMessage.update({
      where: { id },
      data: { status },
    });
  },

  async delete(id: string, db: Db = prisma) {
    return db.contactMessage.delete({ where: { id } });
  },
};
