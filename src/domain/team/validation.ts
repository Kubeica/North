import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .url("Invalid URL")
  .optional()
  .or(z.literal(""))
  .transform((value) => (value ? value : undefined));

const optionalEmail = z
  .string()
  .trim()
  .email("Invalid email")
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

export const teamMemberBaseSchema = z.object({
  nameAr: z.string().trim().min(1, "Arabic name is required").max(160),
  nameEn: z.string().trim().min(1, "English name is required").max(160),
  positionAr: z.string().trim().min(1, "Arabic position is required").max(160),
  positionEn: z.string().trim().min(1, "English position is required").max(160),
  bioAr: optionalString(5000),
  bioEn: optionalString(5000),
  imageUrl: optionalUrl,
  linkedin: optionalUrl,
  email: optionalEmail,
  sortOrder: z.coerce.number().int().min(0).default(0),
  published: z.boolean().default(true),
  isDemo: z.boolean().default(true),
});

export const teamMemberCreateSchema = teamMemberBaseSchema;

export const teamMemberUpdateSchema = teamMemberBaseSchema.partial().extend({
  id: z.string().cuid(),
});

export type TeamMemberCreateInput = z.infer<typeof teamMemberCreateSchema>;
export type TeamMemberUpdateInput = z.infer<typeof teamMemberUpdateSchema>;
