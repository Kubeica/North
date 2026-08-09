import { describe, expect, it } from "vitest";

import {
  getRequiredPermissionForPath,
} from "@/lib/auth/route-guards";

describe("ADMIN_ROUTE_PERMISSIONS", () => {
  it("maps statistics and project-categories", () => {
    expect(getRequiredPermissionForPath("/admin/statistics")).toBe(
      "statistics:read",
    );
    expect(
      getRequiredPermissionForPath("/admin/statistics/abc/edit"),
    ).toBe("statistics:read");
    expect(getRequiredPermissionForPath("/admin/project-categories")).toBe(
      "projects:read",
    );
    expect(
      getRequiredPermissionForPath("/admin/project-categories/x/edit"),
    ).toBe("projects:read");
  });

  it("does not confuse project-categories with projects", () => {
    expect(getRequiredPermissionForPath("/admin/projects")).toBe(
      "projects:read",
    );
    expect(getRequiredPermissionForPath("/admin/projects/new")).toBe(
      "projects:read",
    );
  });
});
