import { describe, expect, it } from "vitest";

import { contactFormSchema } from "@/lib/validation/contact";

describe("contactFormSchema", () => {
  const valid = {
    name: "Demo Inquirer",
    email: "demo@example.com",
    subject: "Project inquiry",
    message: "I would like more information about your services.",
  };

  it("accepts a valid contact payload", () => {
    const result = contactFormSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("demo@example.com");
      expect(result.data.phone).toBeUndefined();
      expect(result.data.company).toBeUndefined();
    }
  });

  it("trims fields and normalizes empty optional strings to undefined", () => {
    const result = contactFormSchema.safeParse({
      ...valid,
      name: "  Demo Inquirer  ",
      phone: "",
      company: "   ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Demo Inquirer");
      expect(result.data.phone).toBeUndefined();
      expect(result.data.company).toBeUndefined();
    }
  });

  it("keeps optional phone and company when provided", () => {
    const result = contactFormSchema.safeParse({
      ...valid,
      phone: "+966 50 000 0001",
      company: "Sample Co",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBe("+966 50 000 0001");
      expect(result.data.company).toBe("Sample Co");
    }
  });

  it("rejects invalid email", () => {
    const result = contactFormSchema.safeParse({
      ...valid,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short name, subject, and message", () => {
    expect(
      contactFormSchema.safeParse({ ...valid, name: "A" }).success,
    ).toBe(false);
    expect(
      contactFormSchema.safeParse({ ...valid, subject: "x" }).success,
    ).toBe(false);
    expect(
      contactFormSchema.safeParse({ ...valid, message: "too short" }).success,
    ).toBe(false);
  });
});
