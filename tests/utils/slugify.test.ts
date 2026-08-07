import { describe, expect, it } from "vitest";

import { slugify } from "@/lib/utils";

describe("slugify", () => {
  it("converts spaces and punctuation to hyphens", () => {
    expect(slugify("Hello World!")).toBe("hello-world");
  });

  it("collapses repeated separators and trims edges", () => {
    expect(slugify("  Foo---Bar  ")).toBe("foo-bar");
  });

  it("preserves Arabic characters", () => {
    expect(slugify("مشروع تجريبي")).toBe("مشروع-تجريبي");
  });

  it("handles mixed latin content", () => {
    expect(slugify("Sample Commercial Tower — Demo")).toBe(
      "sample-commercial-tower-demo",
    );
  });

  it("returns empty string for empty input", () => {
    expect(slugify("")).toBe("");
    expect(slugify("   ")).toBe("");
  });
});
