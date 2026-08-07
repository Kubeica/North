import { redirect } from "next/navigation";

import { auth, handlers, signIn, signOut } from "@/auth";
import { can, type Permission, type Role } from "@/lib/permissions";
import type { SessionUser } from "@/types";

export { auth, handlers, signIn, signOut };

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth();
  const user = session?.user;
  if (!user?.id || !user.email || !user.role) return null;

  return {
    id: user.id,
    name: user.name ?? "",
    email: user.email,
    role: user.role,
  };
}

export async function requireSession(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }
  return user;
}

export async function requireRole(...roles: Role[]): Promise<SessionUser> {
  const user = await requireSession();
  if (!roles.includes(user.role)) {
    redirect("/admin/unauthorized");
  }
  return user;
}

/** Redirects to unauthorized when the role lacks the permission. */
export async function requirePermission(
  permission: Permission,
): Promise<SessionUser> {
  const user = await requireSession();
  if (!can(user.role, permission)) {
    redirect("/admin/unauthorized");
  }
  return user;
}

/**
 * For server actions: throws instead of redirecting so callers can return
 * a structured ActionResult error.
 */
export async function assertPermission(
  permission: Permission,
): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  if (!can(user.role, permission)) {
    throw new Error("FORBIDDEN");
  }
  return user;
}
