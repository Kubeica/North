import type { NextAuthConfig } from "next-auth";

import type { Role } from "@/lib/permissions";

const ADMIN_ONLY_PREFIXES = [
  "/admin/users",
  "/admin/settings",
  "/admin/audit-logs",
] as const;

/**
 * Edge-safe Auth.js config (no Prisma / Node-only imports).
 * Used by middleware; full providers live in auth.ts.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8, // 8 hours
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLogin = pathname.startsWith("/admin/login");
      const isUnauthorized = pathname.startsWith("/admin/unauthorized");
      const isAdmin = pathname.startsWith("/admin");
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role as Role | undefined;

      if (isLogin) {
        if (isLoggedIn) {
          return Response.redirect(
            new URL("/admin/dashboard", request.nextUrl),
          );
        }
        return true;
      }

      if (isUnauthorized) {
        return isLoggedIn;
      }

      if (isAdmin) {
        if (!isLoggedIn) return false;

        const isAdminOnly = ADMIN_ONLY_PREFIXES.some(
          (prefix) =>
            pathname === prefix || pathname.startsWith(`${prefix}/`),
        );
        if (isAdminOnly && role !== "ADMIN") {
          return Response.redirect(
            new URL("/admin/unauthorized", request.nextUrl),
          );
        }

        return true;
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.name = (token.name as string) ?? "";
        session.user.email = (token.email as string) ?? "";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
