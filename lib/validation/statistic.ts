import { z } from "zod";

export const statisticBaseSchema = z.object({
  labelAr: z.string().trim().min(1, "Arabic label is required").max(120),
  labelEn: z.string().trim().min(1, "English label is required").max(120),
  value: z.string().trim().min(1, "Value is required").max(40),
  sortOrder: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

export const statisticCreateSchema = statisticBaseSchema;

export const statisticUpdateSchema = statisticBaseSchema.partial().extend({
  id: z.string().cuid(),
});

export type StatisticCreateInput = z.infer<typeof statisticCreateSchema>;
export type StatisticUpdateInput = z.infer<typeof statisticUpdateSchema>;
