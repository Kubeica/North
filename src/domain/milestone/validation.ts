import { z } from "zod";

import { optionalString } from "@/src/domain/shared/optional-fields";

export const companyMilestoneBaseSchema = z.object({
  year: z.coerce
    .number()
    .int()
    .min(1900, "Year must be 1900 or later")
    .max(2100, "Year must be 2100 or earlier"),
  titleAr: z.string().trim().min(1, "Arabic title is required").max(200),
  titleEn: z.string().trim().min(1, "English title is required").max(200),
  descriptionAr: optionalString(5000),
  descriptionEn: optionalString(5000),
  sortOrder: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

export const companyMilestoneCreateSchema = companyMilestoneBaseSchema;

export const companyMilestoneUpdateSchema = companyMilestoneBaseSchema
  .partial()
  .extend({
    id: z.string().cuid(),
  });

export type CompanyMilestoneCreateInput = z.infer<
  typeof companyMilestoneCreateSchema
>;
export type CompanyMilestoneUpdateInput = z.infer<
  typeof companyMilestoneUpdateSchema
>;
