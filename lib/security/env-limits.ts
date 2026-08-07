function positiveInt(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

export function contactRateLimitConfig() {
  return {
    max: positiveInt(process.env.RATE_LIMIT_CONTACT_MAX, 5),
    windowMs: positiveInt(process.env.RATE_LIMIT_CONTACT_WINDOW_MS, 15 * 60 * 1000),
  };
}

export function loginRateLimitConfig() {
  return {
    max: positiveInt(process.env.RATE_LIMIT_LOGIN_MAX, 10),
    windowMs: positiveInt(process.env.RATE_LIMIT_LOGIN_WINDOW_MS, 15 * 60 * 1000),
  };
}

export function quoteRateLimitConfig() {
  return {
    max: positiveInt(process.env.RATE_LIMIT_QUOTE_MAX, 5),
    windowMs: positiveInt(process.env.RATE_LIMIT_QUOTE_WINDOW_MS, 15 * 60 * 1000),
  };
}

/** Max upload size in bytes from STORAGE_MAX_FILE_SIZE_MB (default 5 MB). */
export function mediaMaxBytes(): number {
  const mb = positiveInt(process.env.STORAGE_MAX_FILE_SIZE_MB, 5);
  return mb * 1024 * 1024;
}
