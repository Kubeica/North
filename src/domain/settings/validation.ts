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
          // Absolute http(s) URLs remain valid for external assets.
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

const optionalEmail = z
  .string()
  .trim()
  .email("Invalid email address")
  .max(254)
  .optional()
  .or(z.literal(""))
  .transform((value) => (value ? value : undefined));

export const companyProfileSchema = z.object({
  nameAr: z.string().trim().min(1, "Arabic name is required").max(200),
  nameEn: z.string().trim().min(1, "English name is required").max(200),
  shortNameAr: optionalString(80),
  shortNameEn: optionalString(80),
  shortDescriptionAr: z
    .string()
    .trim()
    .min(1, "Arabic short description is required")
    .max(500),
  shortDescriptionEn: z
    .string()
    .trim()
    .min(1, "English short description is required")
    .max(500),
  aboutAr: z.string().trim().min(1, "Arabic about is required").max(20000),
  aboutEn: z.string().trim().min(1, "English about is required").max(20000),
  visionAr: z.string().trim().max(5000),
  visionEn: z.string().trim().max(5000),
  missionAr: z.string().trim().max(5000),
  missionEn: z.string().trim().max(5000),
  valuesAr: optionalString(10000),
  valuesEn: optionalString(10000),
  experienceAr: optionalString(10000),
  experienceEn: optionalString(10000),
  capabilitiesAr: optionalString(10000),
  capabilitiesEn: optionalString(10000),
  safetyAr: optionalString(10000),
  safetyEn: optionalString(10000),
  qualityAr: optionalString(10000),
  qualityEn: optionalString(10000),
  whyUsAr: optionalString(10000),
  whyUsEn: optionalString(10000),
  processAr: optionalString(10000),
  processEn: optionalString(10000),
  phone: optionalString(40),
  email: optionalEmail,
  addressAr: optionalString(500),
  addressEn: optionalString(500),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
  logoUrl: optionalUrl,
  faviconUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  facebookUrl: optionalUrl,
  instagramUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  heroImageUrl: optionalUrl,
});

export const companyProfileUpdateSchema = companyProfileSchema.partial().extend({
  id: z.string().cuid().optional(),
});

export const generalSettingsSchema = z.object({
  defaultLanguage: z.enum(["en", "ar"]),
  maintenanceMode: z.boolean().default(false),
  seoTitleEn: z.string().trim().max(200).default(""),
  seoTitleAr: z.string().trim().max(200).default(""),
  seoDescriptionEn: z.string().trim().max(500).default(""),
  seoDescriptionAr: z.string().trim().max(500).default(""),
});

export type CompanyProfileInput = z.infer<typeof companyProfileSchema>;
export type CompanyProfileUpdateInput = z.infer<
  typeof companyProfileUpdateSchema
>;
export type GeneralSettingsInput = z.infer<typeof generalSettingsSchema>;
