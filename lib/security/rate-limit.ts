import {
  rateLimitService,
  type RateLimitResult,
} from "@/src/domain/rate-limit/service";

export type { RateLimitResult };

/**
 * App-facing rate limit helper. Delegates to the domain service.
 */
export async function checkRateLimit(
  key: string,
  max: number,
  windowMs: number,
): Promise<RateLimitResult> {
  return rateLimitService.check(key, max, windowMs);
}
