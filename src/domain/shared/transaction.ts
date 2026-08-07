import { prisma, type Prisma } from "@/src/domain/shared/prisma";

export type TransactionClient = Prisma.TransactionClient;

/**
 * Run multiple repository operations atomically.
 * Domain services use this instead of importing Prisma for ad-hoc queries.
 */
export function runTransaction<T>(
  fn: (tx: TransactionClient) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(fn);
}
