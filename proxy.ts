import NextAuth from "next-auth";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";

import { authConfig } from "@/auth.config";

import { routing } from "./i18n/routing";

const { auth } = NextAuth(authConfig);
const handleI18nRouting = createMiddleware(routing);

/** Paths that must never receive a locale prefix redirect. */
function isNonLocalePath(pathname: string): boolean {
  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
    return true;
  }
  if (pathname === "/uploads" || pathname.startsWith("/uploads/")) {
    return true;
  }
  if (pathname === "/images" || pathname.startsWith("/images/")) {
    return true;
  }
  return (
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  );
}

/**
 * Compose Auth.js (admin protection) with next-intl locale routing.
 * Admin, API, uploads, and other static/metadata paths skip locale handling.
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
    const response = NextResponse.next();
    // Used by admin layout route-permission enforcement.
    response.headers.set("x-pathname", pathname);
    return response;
  }

  if (isNonLocalePath(pathname)) {
    return NextResponse.next();
  }

  return handleI18nRouting(req);
});

export const config = {
  // Exclude Next internals, uploads/images, metadata files, and any dotted
  // static asset path so next-intl never redirects them under /ar or /en.
  matcher: [
    "/((?!_next|_vercel|uploads(?:/|$)|images(?:/|$)|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\..*).*)",
  ],
};
