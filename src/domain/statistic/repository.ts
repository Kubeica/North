import { prisma, type Prisma } from "@/src/domain/shared/prisma";

type Db = Prisma.TransactionClient | typeof prisma;

export const statisticRepository = {
  async listPublished(db: Db = prisma) {
    return db.statistic.findMany({
      where: { published: true, archivedAt: null },
      orderBy: { sortOrder: "asc" },
    });
  },
};
