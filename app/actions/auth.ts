"use server";

import { checkRateLimit } from "@/lib/security/rate-limit";
import { getClientIp } from "@/lib/security/client-ip";
import { loginRateLimitConfig } from "@/lib/security/env-limits";

export type LoginGateResult =
  | { ok: true }
  | { ok: false; error: "rateLimited" };

/**
 * Pre-auth gate for admin login. Limits by IP and email to slow credential stuffing.
 */
export async function assertLoginAllowed(email: string): Promise<LoginGateResult> {
  const { max, windowMs } = loginRateLimitConfig();
  const ip = await getClientIp();
  const normalized = email.trim().toLowerCase() || "unknown";

  const [byIp, byEmail] = await Promise.all([
    checkRateLimit(`login:ip:${ip}`, max, windowMs),
    checkRateLimit(`login:email:${normalized}`, max, windowMs),
  ]);

  if (!byIp.success || !byEmail.success) {
    return { ok: false, error: "rateLimited" };
  }

  return { ok: true };
}
