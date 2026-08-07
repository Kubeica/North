export type ListParams = {
  q?: string;
  page: number;
  pageSize: number;
  filters?: Record<string, string | boolean | undefined>;
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export function normalizePage(page?: number): number {
  return Math.max(1, page ?? 1);
}

export function normalizePageSize(pageSize?: number, fallback = 20): number {
  return Math.max(1, pageSize ?? fallback);
}

export function toSkipTake(page: number, pageSize: number) {
  return {
    skip: (Math.max(1, page) - 1) * Math.max(1, pageSize),
    take: Math.max(1, pageSize),
  };
}

export function paginate<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
): PaginatedResult<T> {
  return {
    items,
    total,
    page: normalizePage(page),
    pageSize: normalizePageSize(pageSize),
  };
}
