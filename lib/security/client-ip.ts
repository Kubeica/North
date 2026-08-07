import { headers } from "next/headers";

/**
 * Resolve client IP behind a trusted reverse proxy.
 * Prefer the first X-Forwarded-For hop only when the proxy is configured to overwrite it.
 */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    "unknown";
  return ip;
}
