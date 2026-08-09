import { z } from "zod";

import {
  optionalHttpUrl,
  optionalMediaUrl,
  optionalString,
} from "@/src/domain/shared/optional-fields";

export const clientBaseSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(160),
  logoUrl: optionalMediaUrl(),
  websiteUrl: optionalHttpUrl(),
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
