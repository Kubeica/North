import { describe, expect, it } from "vitest";

import { quoteRequestsToCsv } from "@/src/domain/quote-request/csv";
import {
  sanitizeMultiline,
  sanitizeText,
} from "@/src/domain/quote-request/sanitize";
import { quoteRequestSubmitSchema } from "@/src/domain/quote-request/validation";
import type { QuoteRequest } from "@prisma/client";

describe("quoteRequestSubmitSchema", () => {
  it("accepts a valid payload", () => {
    const parsed = quoteRequestSubmitSchema.safeParse({
      company: "Acme",
      name: "Ada",
      email: "ada@example.com",
      phone: "+966 50 000 0000",
      projectType: "Fit-out",
      budget: "1M",
      location: "Riyadh",
      timeline: "2026",
      message: "Need a detailed quote for a commercial package.",
      website: "",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects short messages", () => {
    const parsed = quoteRequestSubmitSchema.safeParse({
      company: "Acme",
      name: "Ada",
      email: "ada@example.com",
      projectType: "Fit-out",
      message: "Too short",
    });
    expect(parsed.success).toBe(false);
  });
});

describe("sanitizeText", () => {
  it("strips control characters", () => {
    expect(sanitizeText("Hello\u0000 world")).toBe("Hello world");
  });
});

describe("sanitizeMultiline", () => {
  it("preserves newlines while trimming", () => {
    expect(sanitizeMultiline(" line1\r\nline2 \n")).toBe("line1\nline2");
  });
});

describe("quoteRequestsToCsv", () => {
  it("escapes commas and quotes", () => {
    const row = {
      id: "1",
      company: 'Acme, "Inc"',
      name: "Ada",
      email: "ada@example.com",
      phone: null,
      projectType: "Fit-out",
      budget: null,
      location: null,
      timeline: null,
      message: "Line1\nLine2",
      attachmentUrl: null,
      status: "NEW",
      notes: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    } as QuoteRequest;

    const csv = quoteRequestsToCsv([row]);
    expect(csv.split("\n")[0]).toContain("company");
    expect(csv).toContain('"Acme, ""Inc"""');
    expect(csv).toContain('"Line1\nLine2"');
  });
});
