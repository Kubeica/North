import path from "node:path";

import { describe, expect, it } from "vitest";

import { resolveLocalUploadAbsolutePath } from "@/lib/storage/local";

describe("resolveLocalUploadAbsolutePath", () => {
  const uploadsRoot = path.join(process.cwd(), "public", "uploads");

  it("resolves keys under public/uploads", () => {
    const absolute = resolveLocalUploadAbsolutePath(
      "media/6618e06b-a09b-45b4-bfe1-4be777903dc0.jpg",
    );
    expect(absolute).toBe(
      path.join(
        uploadsRoot,
        "media",
        "6618e06b-a09b-45b4-bfe1-4be777903dc0.jpg",
      ),
    );
  });

  it("rejects path traversal", () => {
    expect(() => resolveLocalUploadAbsolutePath("../secret.txt")).toThrow(
      /Invalid storage key/,
    );
    expect(() =>
      resolveLocalUploadAbsolutePath("media/../../secret.txt"),
    ).toThrow(/Invalid storage key/);
  });
});
