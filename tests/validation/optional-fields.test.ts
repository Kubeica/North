import { describe, expect, it } from "vitest";

import {
  isSafeHttpUrl,
  isSafeLocalAssetPath,
  mediaUrlSchema,
  optionalCuid,
  optionalHttpUrl,
  optionalMediaUrl,
  optionalString,
} from "@/src/domain/shared/optional-fields";
import {
  projectCreateSchema,
  projectGalleryUrlsSchema,
} from "@/src/domain/project/validation";
import { clientUpdateSchema } from "@/src/domain/client/validation";

describe("optionalString", () => {
  const schema = optionalString(100);

  it("clears empty input to null", () => {
    expect(schema.parse("")).toBeNull();
    expect(schema.parse("   ")).toBeNull();
  });

  it("keeps non-empty values", () => {
    expect(schema.parse("hello")).toBe("hello");
  });
});

describe("isSafeLocalAssetPath", () => {
  it("accepts MediaPicker upload paths", () => {
    expect(isSafeLocalAssetPath("/uploads/media/example.jpg")).toBe(true);
    expect(isSafeLocalAssetPath("/uploads/projects/cover.webp")).toBe(true);
    expect(isSafeLocalAssetPath("/images/hero-architecture.png")).toBe(true);
  });

  it("rejects protocol-relative and traversal", () => {
    expect(isSafeLocalAssetPath("//evil.com/x.png")).toBe(false);
    expect(isSafeLocalAssetPath("/uploads/../secret")).toBe(false);
    expect(isSafeLocalAssetPath("/uploads/%2e%2e/secret")).toBe(false);
    expect(isSafeLocalAssetPath("/etc/passwd")).toBe(false);
    expect(isSafeLocalAssetPath("/javascript:alert(1)")).toBe(false);
  });
});

describe("optionalMediaUrl", () => {
  const schema = optionalMediaUrl();

  it("accepts relative upload paths", () => {
    expect(schema.parse("/uploads/media/example.jpg")).toBe(
      "/uploads/media/example.jpg",
    );
  });

  it("accepts absolute http(s) URLs", () => {
    expect(schema.parse("https://cdn.example.com/a.png")).toBe(
      "https://cdn.example.com/a.png",
    );
  });

  it("clears empty to null", () => {
    expect(schema.parse("")).toBeNull();
  });

  it("rejects dangerous and malformed values", () => {
    expect(schema.safeParse("not-a-url").success).toBe(false);
    expect(schema.safeParse("ftp://example.com/x").success).toBe(false);
    expect(schema.safeParse("javascript:alert(1)").success).toBe(false);
    expect(schema.safeParse("data:text/html,hi").success).toBe(false);
    expect(schema.safeParse("//evil.com/x").success).toBe(false);
    expect(schema.safeParse("/uploads/../x").success).toBe(false);
  });
});

describe("optionalHttpUrl", () => {
  const schema = optionalHttpUrl();

  it("accepts http(s) only", () => {
    expect(schema.parse("https://example.com")).toBe("https://example.com");
    expect(isSafeHttpUrl("http://example.com")).toBe(true);
  });

  it("rejects relative and dangerous schemes", () => {
    expect(schema.safeParse("/uploads/x.jpg").success).toBe(false);
    expect(schema.safeParse("javascript:alert(1)").success).toBe(false);
    expect(schema.safeParse("//evil.com").success).toBe(false);
  });
});

describe("optionalCuid", () => {
  const schema = optionalCuid();

  it("clears empty to null for disconnect", () => {
    expect(schema.parse("")).toBeNull();
  });

  it("rejects non-cuid values", () => {
    expect(schema.safeParse("abc").success).toBe(false);
  });
});

describe("projectCreateSchema coverImageUrl", () => {
  const base = {
    slug: "tower-one",
    titleAr: "برج",
    titleEn: "Tower",
    descriptionAr: "وصف",
    descriptionEn: "Description long enough",
    status: "PLANNED" as const,
    featured: false,
    published: true,
    isDemo: false,
  };

  it("accepts MediaPicker relative cover URLs", () => {
    const parsed = projectCreateSchema.safeParse({
      ...base,
      coverImageUrl: "/uploads/media/cover.webp",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.coverImageUrl).toBe("/uploads/media/cover.webp");
    }
  });

  it("clears empty cover URL to null", () => {
    const parsed = projectCreateSchema.safeParse({
      ...base,
      coverImageUrl: "",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.coverImageUrl).toBeNull();
    }
  });
});

describe("projectGalleryUrlsSchema", () => {
  it("accepts safe upload URLs", () => {
    const parsed = projectGalleryUrlsSchema.safeParse([
      "/uploads/media/a.jpg",
      "https://cdn.example.com/b.png",
    ]);
    expect(parsed.success).toBe(true);
  });

  it("rejects javascript and protocol-relative gallery URLs", () => {
    expect(
      projectGalleryUrlsSchema.safeParse(["javascript:alert(1)"]).success,
    ).toBe(false);
    expect(projectGalleryUrlsSchema.safeParse(["//evil.com/x"]).success).toBe(
      false,
    );
    expect(mediaUrlSchema.safeParse("/uploads/../x").success).toBe(false);
  });
});

describe("clientUpdateSchema optional clears", () => {
  it("maps empty logo and website to null", () => {
    const parsed = clientUpdateSchema.safeParse({
      id: "clxxxxxxxxxxxxxxxxxxxxxxxxx",
      name: "Acme",
      logoUrl: "",
      websiteUrl: "",
      sortOrder: 0,
      published: true,
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.logoUrl).toBeNull();
      expect(parsed.data.websiteUrl).toBeNull();
    }
  });
});
