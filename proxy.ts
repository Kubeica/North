import NextAuth from "next-auth";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";

import { authConfig } from "@/auth.config";

import { routing } from "./i18n/routing";

const { auth } = NextAuth(authConfig);
const handleI18nRouting = createMiddleware(routing);

/**
 * Compose Auth.js (admin protection) with next-intl locale routing.
 * Admin + API skip locale prefix handling.
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
    const response = NextResponse.next();
    // Used by admin layout route-permission enforcement.
    response.headers.set("x-pathname", pathname);
    return response;
  }

  return handleI18nRouting(req);
});

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
