import { rateLimitRepository } from "@/src/domain/rate-limit/repository";

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: Date;
};

/**
 * Fixed-window rate limiter. Business rules live here; persistence in the repository.
 */
export const rateLimitService = {
  async check(
    key: string,
    max: number,
    windowMs: number,
  ): Promise<RateLimitResult> {
    if (!key || max < 1 || windowMs < 1) {
      throw new Error("Invalid rate limit parameters");
    }

    const now = new Date();
    const existing = await rateLimitRepository.findByKey(key);

    if (!existing) {
      const created = await rateLimitRepository.create({
        key,
        count: 1,
        windowStart: now,
      });
      return {
        success: true,
        limit: max,
        remaining: Math.max(0, max - created.count),
        resetAt: new Date(created.windowStart.getTime() + windowMs),
      };
    }

    const elapsed = now.getTime() - existing.windowStart.getTime();
    if (elapsed >= windowMs) {
      const reset = await rateLimitRepository.update(key, {
        count: 1,
        windowStart: now,
      });
      return {
        success: true,
        limit: max,
        remaining: Math.max(0, max - reset.count),
        resetAt: new Date(reset.windowStart.getTime() + windowMs),
      };
    }

    if (existing.count >= max) {
      return {
        success: false,
        limit: max,
        remaining: 0,
        resetAt: new Date(existing.windowStart.getTime() + windowMs),
      };
    }

    const updated = await rateLimitRepository.update(key, {
      count: { increment: 1 },
    });

    return {
      success: true,
      limit: max,
      remaining: Math.max(0, max - updated.count),
      resetAt: new Date(existing.windowStart.getTime() + windowMs),
    };
  },
};
