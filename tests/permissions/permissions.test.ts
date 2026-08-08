import { describe, expect, it } from "vitest";

import { can, isAdmin, type Permission } from "@/lib/permissions";

const EDITOR_ALLOWED: Permission[] = [
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
];

const ADMIN_ONLY: Permission[] = [
  "users:read",
  "users:write",
  "settings:read",
  "settings:write",
  "audit:read",
];

describe("permissions", () => {
  it("identifies ADMIN role", () => {
    expect(isAdmin("ADMIN")).toBe(true);
    expect(isAdmin("EDITOR")).toBe(false);
  });

  it("grants ADMIN every permission", () => {
    for (const permission of [...EDITOR_ALLOWED, ...ADMIN_ONLY]) {
      expect(can("ADMIN", permission)).toBe(true);
    }
  });

  it("allows EDITOR content permissions", () => {
    for (const permission of EDITOR_ALLOWED) {
      expect(can("EDITOR", permission)).toBe(true);
    }
  });

  it("denies EDITOR admin-only permissions", () => {
    for (const permission of ADMIN_ONLY) {
      expect(can("EDITOR", permission)).toBe(false);
    }
  });
});
