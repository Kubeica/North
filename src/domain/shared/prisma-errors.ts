import { Prisma } from "@prisma/client";

import { ConflictError } from "@/src/domain/shared/errors";

export function isUniqueConflict(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

/** Re-throw unique constraint violations as ConflictError; otherwise rethrow. */
export function rethrowIfUniqueConflict(
  error: unknown,
  message: string,
): never {
  if (isUniqueConflict(error)) {
    throw new ConflictError(message);
  }
  throw error;
}
