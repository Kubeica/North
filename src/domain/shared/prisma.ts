/**
 * Prisma client and types for the domain data layer.
 *
 * - Repositories own all queries and mutations.
 * - Services may import `prisma` only to orchestrate `$transaction`,
 *   passing the transaction client into repository methods.
 * - Server Actions and API routes must never import this module.
 */
export { prisma } from "@/lib/db/prisma";
export type { Prisma, PrismaClient } from "@prisma/client";
