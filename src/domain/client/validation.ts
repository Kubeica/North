import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine(
    (value) =>
      !value ||
      value.startsWith("/") ||
      (() => {
        try {
          const parsed = new URL(value);
          return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
          return false;
        }
      })(),
    { message: "Invalid URL" },
  )
  .transform((value) => (value ? value : undefined));

const optionalString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined));

export const clientBaseSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(160),
  logoUrl: optionalUrl,
  websiteUrl: optionalUrl,
  descriptionAr: optionalString(2000),
  descriptionEn: optionalString(2000),
  sortOrder: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

export const clientCreateSchema = clientBaseSchema;

export const clientUpdateSchema = clientBaseSchema.partial().extend({
  id: z.string().cuid(),
});

export type ClientCreateInput = z.infer<typeof clientCreateSchema>;
export type ClientUpdateInput = z.infer<typeof clientUpdateSchema>;
