import { describe, expect, it } from "vitest";

import {
  statisticCreateSchema,
  statisticUpdateSchema,
} from "@/lib/validation/statistic";
import { can } from "@/lib/permissions";

describe("statisticCreateSchema", () => {
  it("accepts a valid create payload", () => {
    const parsed = statisticCreateSchema.safeParse({
      labelAr: "مشروع",
      labelEn: "Projects",
      value: "25+",
      sortOrder: 1,
      published: false,
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects empty value", () => {
    const parsed = statisticCreateSchema.safeParse({
      labelAr: "مشروع",
      labelEn: "Projects",
      value: "",
      sortOrder: 0,
      published: true,
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects missing Arabic label", () => {
    const parsed = statisticCreateSchema.safeParse({
      labelAr: "",
      labelEn: "Projects",
      value: "10",
      sortOrder: 0,
      published: true,
    });
    expect(parsed.success).toBe(false);
  });
});

describe("statisticUpdateSchema", () => {
  it("requires a cuid id", () => {
    const parsed = statisticUpdateSchema.safeParse({
      id: "not-a-cuid",
      value: "12",
    });
    expect(parsed.success).toBe(false);
  });

  it("accepts publish toggle with valid id", () => {
    const parsed = statisticUpdateSchema.safeParse({
      id: "clg9k0zq00000qzrmn4i5o9k1",
      published: false,
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.published).toBe(false);
    }
  });
});

describe("statistic permissions", () => {
  it("allows EDITOR statistics write (existing RBAC)", () => {
    expect(can("EDITOR", "statistics:write")).toBe(true);
    expect(can("EDITOR", "statistics:read")).toBe(true);
  });

  it("denies unauthenticated role patterns via ADMIN-only settings", () => {
    expect(can("EDITOR", "settings:write")).toBe(false);
    expect(can("ADMIN", "statistics:write")).toBe(true);
  });
});
