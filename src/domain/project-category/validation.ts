import { z } from "zod";

const optionalString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined));

export const projectCategoryBaseSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case"),
  nameAr: z.string().trim().min(1, "Arabic name is required").max(160),
  nameEn: z.string().trim().min(1, "English name is required").max(160),
  descriptionAr: optionalString(2000),
  descriptionEn: optionalString(2000),
  sortOrder: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

export const projectCategoryCreateSchema = projectCategoryBaseSchema;

export const projectCategoryUpdateSchema = projectCategoryBaseSchema
  .partial()
  .extend({
    id: z.string().cuid(),
  });

export type ProjectCategoryCreateInput = z.infer<
  typeof projectCategoryCreateSchema
>;
export type ProjectCategoryUpdateInput = z.infer<
  typeof projectCategoryUpdateSchema
>;
