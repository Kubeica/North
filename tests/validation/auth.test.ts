import { describe, expect, it } from "vitest";

import { loginSchema } from "@/lib/validation/auth";

describe("loginSchema", () => {
  it("accepts a valid login payload", () => {
    const result = loginSchema.safeParse({
      email: "admin@northernmeteor.com",
      password: "Admin@12345!",
    });
    expect(result.success).toBe(true);
  });

  it("trims email", () => {
    const result = loginSchema.safeParse({
      email: "  editor@northernmeteor.com  ",
      password: "Editor@12345!",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("editor@northernmeteor.com");
    }
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-valid",
      password: "Admin@12345!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects passwords shorter than 8 characters", () => {
    const result = loginSchema.safeParse({
      email: "admin@northernmeteor.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing fields", () => {
    expect(loginSchema.safeParse({}).success).toBe(false);
    expect(
      loginSchema.safeParse({ email: "admin@northernmeteor.com" }).success,
    ).toBe(false);
  });
});
