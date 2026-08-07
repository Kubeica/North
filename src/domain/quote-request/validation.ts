import { z } from "zod";

const optionalString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined));

export const quoteRequestStatusSchema = z.enum([
  "NEW",
  "IN_REVIEW",
  "CONTACTED",
  "WON",
  "LOST",
  "ARCHIVED",
]);

/** Public quote request form schema. */
export const quoteRequestSubmitSchema = z.object({
  company: z.string().trim().min(1, "Company is required").max(200),
  name: z.string().trim().min(1, "Name is required").max(160),
  email: z.string().trim().email("Invalid email").max(200),
  phone: optionalString(60),
  projectType: z.string().trim().min(1, "Project type is required").max(160),
  budget: optionalString(120),
  location: optionalString(200),
  timeline: optionalString(160),
  message: z.string().trim().min(10, "Message is too short").max(5000),
  /** Honeypot — must remain empty. */
  website: optionalString(200),
  attachmentUrl: optionalString(2000),
});

export const quoteRequestUpdateStatusSchema = z.object({
  id: z.string().cuid(),
  status: quoteRequestStatusSchema,
});

export const quoteRequestUpdateNotesSchema = z.object({
  id: z.string().cuid(),
  notes: optionalString(10000),
});

export type QuoteRequestSubmitInput = z.infer<typeof quoteRequestSubmitSchema>;
export type QuoteRequestUpdateStatusInput = z.infer<
  typeof quoteRequestUpdateStatusSchema
>;
export type QuoteRequestUpdateNotesInput = z.infer<
  typeof quoteRequestUpdateNotesSchema
>;
export type QuoteRequestStatusValue = z.infer<typeof quoteRequestStatusSchema>;
