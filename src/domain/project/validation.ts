import { z } from "zod";

export const projectStatusSchema = z.enum([
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
  "ON_HOLD",
]);

const optionalUrl = z
  .string()
  .trim()
  .url("Invalid URL")
  .optional()
  .or(z.literal(""))
  .transform((value) => (value ? value : undefined));

const optionalString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined));

export const projectBaseSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case"),
  titleAr: z.string().trim().min(1, "Arabic title is required").max(200),
  titleEn: z.string().trim().min(1, "English title is required").max(200),
  summaryAr: optionalString(500),
  summaryEn: optionalString(500),
  descriptionAr: z
    .string()
    .trim()
    .min(1, "Arabic description is required")
    .max(20000),
  descriptionEn: z
    .string()
    .trim()
    .min(1, "English description is required")
    .max(20000),
  locationAr: optionalString(200),
  locationEn: optionalString(200),
  coverImageUrl: optionalUrl,
  clientId: z
    .string()
    .cuid()
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined)),
  categoryId: z
    .string()
    .cuid()
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined)),
  status: projectStatusSchema.default("PLANNED"),
  startDate: z.coerce.date().optional().nullable(),
  completionDate: z.coerce.date().optional().nullable(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  seoTitleAr: optionalString(200),
  seoTitleEn: optionalString(200),
  seoDescriptionAr: optionalString(320),
  seoDescriptionEn: optionalString(320),
  scopeAr: optionalString(5000),
  scopeEn: optionalString(5000),
  isDemo: z.boolean().default(true),
});

export const projectCreateSchema = projectBaseSchema;

export const projectUpdateSchema = projectBaseSchema.partial().extend({
  id: z.string().cuid(),
});

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
