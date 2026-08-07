/**
 * Run a Prisma query and return a fallback when the DB is unavailable.
 */
export async function safeQuery<T>(
  query: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await query();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[lib/data] Query failed, using fallback:", error);
    }
    return fallback;
  }
}
