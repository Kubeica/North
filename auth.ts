import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from "@/auth.config";
import { AuditAction } from "@/lib/audit/actions";
import type { Role } from "@/lib/permissions";
import { loginSchema } from "@/lib/validation/auth";
import { auditService } from "@/src/domain/audit/service";
import { userService } from "@/src/domain/user/service";

const SESSION_REVALIDATE_MS = 5 * 60 * 1000;

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await userService.verifyCredentials(
          parsed.data.email.toLowerCase(),
          parsed.data.password,
        );
        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as Role,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.activeCheckedAt = Date.now();
        delete token.error;
        return token;
      }

      const id = typeof token.id === "string" ? token.id : undefined;
      if (!id) return token;

      const checkedAt =
        typeof token.activeCheckedAt === "number" ? token.activeCheckedAt : 0;
      if (Date.now() - checkedAt < SESSION_REVALIDATE_MS) {
        return token;
      }

      try {
        const dbUser = await userService.getById(id);
        if (!dbUser.active) {
          return { ...token, error: "InactiveUser" };
        }
        token.role = dbUser.role as Role;
        token.name = dbUser.name;
        token.email = dbUser.email;
        token.activeCheckedAt = Date.now();
        delete token.error;
      } catch {
        return { ...token, error: "InactiveUser" };
      }

      return token;
    },
    session({ session, token }) {
      if (token.error === "InactiveUser") {
        // Invalidate stale sessions for deactivated / missing users.
        return {
          ...session,
          user: undefined,
          expires: new Date(0).toISOString(),
        } as unknown as typeof session;
      }

      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.name = (token.name as string) ?? "";
        session.user.email = (token.email as string) ?? "";
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      if (!user.id) return;
      try {
        await auditService.record(
          { userId: user.id },
          {
            action: AuditAction.LOGIN,
            entity: "User",
            entityId: user.id,
            metadata: {
              email: user.email,
              name: user.name,
            },
          },
        );
      } catch (error) {
        console.error("Failed to write LOGIN audit log", error);
      }
    },
    async signOut(message) {
      const token = "token" in message ? message.token : null;
      const userId =
        typeof token?.id === "string"
          ? token.id
          : typeof token?.sub === "string"
            ? token.sub
            : null;
      if (!userId) return;
      try {
        await auditService.record(
          { userId },
          {
            action: AuditAction.LOGOUT,
            entity: "User",
            entityId: userId,
          },
        );
      } catch (error) {
        console.error("Failed to write LOGOUT audit log", error);
      }
    },
  },
});
