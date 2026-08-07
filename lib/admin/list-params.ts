export type ListSearchParams = Record<
  string,
  string | string[] | undefined
>;

export type ParseListParamsOptions = {
  pageSize?: number;
  /** Extra filter keys to extract (besides `q` and `page`). */
  filterKeys?: string[];
};

export type ParsedListParams = {
  q: string;
  page: number;
  pageSize: number;
  /** Read a single string param (first value if array). */
  get: (key: string) => string | undefined;
  /** Named filter values for keys provided in options.filterKeys (or all non-q/page keys). */
  filters: Record<string, string | undefined>;
};

function firstValue(
  value: string | string[] | undefined,
): string | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Normalize Next.js searchParams for admin list pages.
 * Accepts a plain object (after `await searchParams`).
 */
export function parseListParams(
  searchParams: ListSearchParams | undefined | null,
  options: ParseListParamsOptions = {},
): ParsedListParams {
  const pageSize = Math.max(1, options.pageSize ?? 20);
  const sp = searchParams ?? {};

  const get = (key: string) => {
    const raw = firstValue(sp[key]);
    if (raw == null) return undefined;
    const trimmed = raw.trim();
    return trimmed.length ? trimmed : undefined;
  };

  const q = get("q") ?? "";
  const page = Math.max(1, Number(get("page") ?? 1) || 1);

  const filterKeys =
    options.filterKeys ??
    Object.keys(sp).filter((key) => key !== "q" && key !== "page");

  const filters: Record<string, string | undefined> = {};
  for (const key of filterKeys) {
    filters[key] = get(key);
  }

  return { q, page, pageSize, get, filters };
}
