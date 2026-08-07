export type Role = "ADMIN" | "EDITOR";

export type Permission =
  | "projects:read"
  | "projects:write"
  | "services:read"
  | "services:write"
  | "clients:read"
  | "clients:write"
  | "team:read"
  | "team:write"
  | "milestones:read"
  | "milestones:write"
  | "statistics:read"
  | "statistics:write"
  | "media:read"
  | "media:write"
  | "messages:read"
  | "messages:write"
  | "quotes:read"
  | "quotes:write"
  | "company:read"
  | "company:write"
  | "users:read"
  | "users:write"
  | "settings:read"
  | "settings:write"
  | "audit:read";

const EDITOR_PERMISSIONS: ReadonlySet<Permission> = new Set([
  "projects:read",
  "projects:write",
  "services:read",
  "services:write",
  "clients:read",
  "clients:write",
  "team:read",
  "team:write",
  "milestones:read",
  "milestones:write",
  "statistics:read",
  "statistics:write",
  "media:read",
  "media:write",
  "messages:read",
  "messages:write",
  "quotes:read",
  "quotes:write",
  "company:read",
  "company:write",
]);

const ADMIN_ONLY_PERMISSIONS: ReadonlySet<Permission> = new Set([
  "users:read",
  "users:write",
  "settings:read",
  "settings:write",
  "audit:read",
]);

/** ADMIN has full access; EDITOR cannot manage users, settings, or audit. */
export function can(role: Role, permission: Permission): boolean {
  if (role === "ADMIN") return true;
  if (ADMIN_ONLY_PERMISSIONS.has(permission)) return false;
  return EDITOR_PERMISSIONS.has(permission);
}

export function isAdmin(role: Role): boolean {
  return role === "ADMIN";
}
