import { prisma, type Prisma } from "@/src/domain/shared/prisma";

type Db = Prisma.TransactionClient | typeof prisma;

export const rateLimitRepository = {
  async findByKey(key: string, db: Db = prisma) {
    return db.rateLimitBucket.findUnique({ where: { key } });
  },

  async create(
    data: { key: string; count: number; windowStart: Date },
    db: Db = prisma,
  ) {
    return db.rateLimitBucket.create({ data });
  },

  async update(
    key: string,
    data: { count?: number | { increment: number }; windowStart?: Date },
    db: Db = prisma,
  ) {
    return db.rateLimitBucket.update({
      where: { key },
      data,
    });
  },
};
