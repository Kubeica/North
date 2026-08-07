import { describe, expect, it } from "vitest";

import { localized } from "@/lib/i18n/get-localized";

describe("localized", () => {
  const sample = {
    titleAr: "عنوان",
    titleEn: "Title",
    summaryAr: "",
    summaryEn: "English summary",
  };

  it("returns Arabic field for ar locale", () => {
    expect(localized(sample, "ar", "title")).toBe("عنوان");
  });

  it("returns English field for en locale", () => {
    expect(localized(sample, "en", "title")).toBe("Title");
  });

  it("falls back to the other locale when primary is empty", () => {
    expect(localized(sample, "ar", "summary")).toBe("English summary");
  });

  it("returns empty string when neither locale has a value", () => {
    expect(localized({ nameAr: "", nameEn: "" }, "en", "name")).toBe("");
    expect(localized({}, "ar", "missing")).toBe("");
  });
});
