import type { Permission } from "@/lib/permissions";

/**
 * Maps admin route prefixes to required read permissions.
 * Enforced server-side in the admin layout — never rely on nav visibility alone.
 */
export const ADMIN_ROUTE_PERMISSIONS: ReadonlyArray<{
  prefix: string;
  permission: Permission;
}> = [
  { prefix: "/admin/projects", permission: "projects:read" },
  { prefix: "/admin/services", permission: "services:read" },
  { prefix: "/admin/clients", permission: "clients:read" },
  { prefix: "/admin/messages", permission: "messages:read" },
  { prefix: "/admin/quote-requests", permission: "quotes:read" },
  { prefix: "/admin/media", permission: "media:read" },
  { prefix: "/admin/team", permission: "team:read" },
  { prefix: "/admin/milestones", permission: "milestones:read" },
  { prefix: "/admin/users", permission: "users:read" },
  { prefix: "/admin/settings", permission: "settings:read" },
  { prefix: "/admin/audit-logs", permission: "audit:read" },
];

/** Public admin paths that skip permission checks (auth still required except login). */
export const ADMIN_PUBLIC_PATHS = [
  "/admin/login",
  "/admin/unauthorized",
] as const;

export function getRequiredPermissionForPath(
  pathname: string,
): Permission | null {
  const match = ADMIN_ROUTE_PERMISSIONS.find(
    (route) =>
      pathname === route.prefix || pathname.startsWith(`${route.prefix}/`),
  );
  return match?.permission ?? null;
}

export function isAdminPublicPath(pathname: string): boolean {
  return ADMIN_PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}
