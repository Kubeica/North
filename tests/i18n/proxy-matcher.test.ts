import { describe, expect, it } from "vitest";

/** Mirrors `proxy.ts` config.matcher — keep in sync when changing exclusions. */
const MATCHER =
  "/((?!_next|_vercel|uploads(?:/|$)|images(?:/|$)|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\..*).*)";

function matchesProxy(pathname: string): boolean {
  return new RegExp(`^${MATCHER}$`).test(pathname);
}

describe("proxy matcher locale bypass", () => {
  it("does not match upload and static asset paths", () => {
    expect(matchesProxy("/uploads/media/foo.jpg")).toBe(false);
    expect(matchesProxy("/uploads/media/foo")).toBe(false);
    expect(matchesProxy("/uploads")).toBe(false);
    expect(matchesProxy("/images/logo.png")).toBe(false);
    expect(matchesProxy("/favicon.ico")).toBe(false);
    expect(matchesProxy("/robots.txt")).toBe(false);
    expect(matchesProxy("/sitemap.xml")).toBe(false);
  });

  it("still matches locale and admin routes", () => {
    expect(matchesProxy("/")).toBe(true);
    expect(matchesProxy("/ar")).toBe(true);
    expect(matchesProxy("/en")).toBe(true);
    expect(matchesProxy("/ar/services")).toBe(true);
    expect(matchesProxy("/admin/login")).toBe(true);
  });
});
