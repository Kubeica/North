import { describe, expect, it } from "vitest";

import { can } from "@/lib/permissions";
import {
  projectCategoryCreateSchema,
  projectCategoryUpdateSchema,
} from "@/src/domain/project-category/validation";

describe("projectCategoryCreateSchema", () => {
  it("accepts a valid category", () => {
    const parsed = projectCategoryCreateSchema.safeParse({
      slug: "residential",
      nameAr: "سكني",
      nameEn: "Residential",
      descriptionEn: "Homes",
      sortOrder: 0,
      published: true,
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects invalid slug", () => {
    const parsed = projectCategoryCreateSchema.safeParse({
      slug: "Bad Slug",
      nameAr: "سكني",
      nameEn: "Residential",
      sortOrder: 0,
      published: true,
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects empty English name", () => {
    const parsed = projectCategoryCreateSchema.safeParse({
      slug: "commercial",
      nameAr: "تجاري",
      nameEn: "",
      sortOrder: 0,
      published: true,
    });
    expect(parsed.success).toBe(false);
  });
});

describe("projectCategoryUpdateSchema", () => {
  it("requires id", () => {
    const parsed = projectCategoryUpdateSchema.safeParse({
      nameEn: "Updated",
    });
    expect(parsed.success).toBe(false);
  });
});

describe("project category permissions", () => {
  it("gates category admin under projects permissions", () => {
    expect(can("EDITOR", "projects:write")).toBe(true);
    expect(can("EDITOR", "projects:read")).toBe(true);
  });
});
