import { z } from "zod";

import {
  optionalEmail,
  optionalHttpUrl,
  optionalMediaUrl,
  optionalString,
} from "@/src/domain/shared/optional-fields";

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
  email: optionalEmail(),
  addressAr: optionalString(500),
  addressEn: optionalString(500),
  // Avoid z.coerce.number() on null/"" (Number(null)===0). Empty clears the field.
  latitude: z.preprocess(
    (value) =>
      value === "" || value === null || value === undefined ? null : value,
    z.number().min(-90).max(90).nullable(),
  ),
  longitude: z.preprocess(
    (value) =>
      value === "" || value === null || value === undefined ? null : value,
    z.number().min(-180).max(180).nullable(),
  ),
  logoUrl: optionalMediaUrl(),
  faviconUrl: optionalMediaUrl(),
  linkedinUrl: optionalHttpUrl(),
  facebookUrl: optionalHttpUrl(),
  instagramUrl: optionalHttpUrl(),
  youtubeUrl: optionalHttpUrl(),
  heroImageUrl: optionalMediaUrl(),
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
