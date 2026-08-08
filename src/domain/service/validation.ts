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

export const serviceBaseSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case"),
  nameAr: z.string().trim().min(1, "Arabic name is required").max(160),
  nameEn: z.string().trim().min(1, "English name is required").max(160),
  descriptionAr: z
    .string()
    .trim()
    .min(1, "Arabic description is required")
    .max(10000),
  descriptionEn: z
    .string()
    .trim()
    .min(1, "English description is required")
    .max(10000),
  icon: optionalString(80),
  imageUrl: optionalUrl,
  sortOrder: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(true),
  isDemo: z.boolean().default(true),
});

export const serviceCreateSchema = serviceBaseSchema;

export const serviceUpdateSchema = serviceBaseSchema.partial().extend({
  id: z.string().cuid(),
});

export type ServiceCreateInput = z.infer<typeof serviceCreateSchema>;
export type ServiceUpdateInput = z.infer<typeof serviceUpdateSchema>;
