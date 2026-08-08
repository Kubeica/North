import { describe, expect, it } from "vitest";

import {
  DEFAULT_FAVICON_PATH,
  localizedSiteSeo,
  pickCmsOrFallback,
  resolveFaviconUrl,
} from "@/lib/seo/site-defaults";

describe("pickCmsOrFallback", () => {
  it("uses CMS value when present", () => {
    expect(pickCmsOrFallback(" CMS Title ", "fallback")).toBe("CMS Title");
  });

  it("falls back when CMS value is empty", () => {
    expect(pickCmsOrFallback("", "fallback")).toBe("fallback");
    expect(pickCmsOrFallback(null, "fallback")).toBe("fallback");
    expect(pickCmsOrFallback(undefined, "fallback")).toBe("fallback");
    expect(pickCmsOrFallback("   ", "fallback")).toBe("fallback");
  });
});

describe("resolveFaviconUrl", () => {
  it("uses CMS favicon when present", () => {
    expect(resolveFaviconUrl("/uploads/brand.ico")).toBe("/uploads/brand.ico");
  });

  it("falls back to local favicon when absent", () => {
    expect(resolveFaviconUrl(null)).toBe(DEFAULT_FAVICON_PATH);
    expect(resolveFaviconUrl("")).toBe(DEFAULT_FAVICON_PATH);
  });
});

describe("localizedSiteSeo", () => {
  const defaults = {
    titleEn: "EN Title",
    titleAr: "عنوان",
    descriptionEn: "EN desc",
    descriptionAr: "وصف",
  };

  it("returns Arabic fields for ar locale", () => {
    expect(localizedSiteSeo(defaults, "ar")).toEqual({
      title: "عنوان",
      description: "وصف",
    });
  });

  it("returns English fields for en locale", () => {
    expect(localizedSiteSeo(defaults, "en")).toEqual({
      title: "EN Title",
      description: "EN desc",
    });
  });
});
