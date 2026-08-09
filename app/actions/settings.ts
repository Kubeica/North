"use server";

import { revalidatePath } from "next/cache";

import {
  actionError,
  actionOk,
  parseBoolean,
  parseOptionalString,
  zodFieldErrors,
  type ActionResult,
} from "@/lib/admin/action";
import { mapDomainError } from "@/lib/admin/map-domain-error";
import { assertPermission } from "@/lib/auth/session";
import { settingsService } from "@/src/domain/settings/service";
import {
  companyProfileSchema,
  generalSettingsSchema,
} from "@/src/domain/settings/validation";

async function requireSettingsWrite() {
  try {
    return await assertPermission("settings:write");
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "UNAUTHORIZED") {
      return actionError("Please sign in again to save settings");
    }
    if (message === "FORBIDDEN") {
      return actionError("You do not have permission to update settings");
    }
    throw error;
  }
}

function formToCompanyPayload(formData: FormData) {
  const num = (key: string) => {
    const v = String(formData.get(key) ?? "").trim();
    if (!v) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  return {
    nameAr: String(formData.get("nameAr") ?? ""),
    nameEn: String(formData.get("nameEn") ?? ""),
    shortNameAr: parseOptionalString(formData.get("shortNameAr")),
    shortNameEn: parseOptionalString(formData.get("shortNameEn")),
    shortDescriptionAr: String(formData.get("shortDescriptionAr") ?? ""),
    shortDescriptionEn: String(formData.get("shortDescriptionEn") ?? ""),
    aboutAr: String(formData.get("aboutAr") ?? ""),
    aboutEn: String(formData.get("aboutEn") ?? ""),
    visionAr: String(formData.get("visionAr") ?? ""),
    visionEn: String(formData.get("visionEn") ?? ""),
    missionAr: String(formData.get("missionAr") ?? ""),
    missionEn: String(formData.get("missionEn") ?? ""),
    valuesAr: parseOptionalString(formData.get("valuesAr")),
    valuesEn: parseOptionalString(formData.get("valuesEn")),
    experienceAr: parseOptionalString(formData.get("experienceAr")),
    experienceEn: parseOptionalString(formData.get("experienceEn")),
    capabilitiesAr: parseOptionalString(formData.get("capabilitiesAr")),
    capabilitiesEn: parseOptionalString(formData.get("capabilitiesEn")),
    safetyAr: parseOptionalString(formData.get("safetyAr")),
    safetyEn: parseOptionalString(formData.get("safetyEn")),
    qualityAr: parseOptionalString(formData.get("qualityAr")),
    qualityEn: parseOptionalString(formData.get("qualityEn")),
    whyUsAr: parseOptionalString(formData.get("whyUsAr")),
    whyUsEn: parseOptionalString(formData.get("whyUsEn")),
    processAr: parseOptionalString(formData.get("processAr")),
    processEn: parseOptionalString(formData.get("processEn")),
    phone: parseOptionalString(formData.get("phone")),
    email: parseOptionalString(formData.get("email")) ?? "",
    addressAr: parseOptionalString(formData.get("addressAr")),
    addressEn: parseOptionalString(formData.get("addressEn")),
    latitude: num("latitude"),
    longitude: num("longitude"),
    logoUrl: parseOptionalString(formData.get("logoUrl")) ?? "",
    faviconUrl: parseOptionalString(formData.get("faviconUrl")) ?? "",
    linkedinUrl: parseOptionalString(formData.get("linkedinUrl")) ?? "",
    facebookUrl: parseOptionalString(formData.get("facebookUrl")) ?? "",
    instagramUrl: parseOptionalString(formData.get("instagramUrl")) ?? "",
    youtubeUrl: parseOptionalString(formData.get("youtubeUrl")) ?? "",
    heroImageUrl: parseOptionalString(formData.get("heroImageUrl")) ?? "",
  };
}

export async function updateCompanySettings(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireSettingsWrite();
  if (!("id" in auth)) return auth;

  const payload = formToCompanyPayload(formData);
  const parsed = companyProfileSchema.safeParse(payload);
  if (!parsed.success) {
    return actionError("Validation failed", zodFieldErrors(parsed.error.issues));
  }

  try {
    const profile = await settingsService.updateCompany(
      { userId: auth.id },
      parsed.data,
    );
    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    revalidatePath("/[locale]", "layout");
    revalidatePath("/[locale]/about", "page");
    revalidatePath("/[locale]/contact", "page");
    return actionOk({ id: profile.id }, "Company profile saved");
  } catch (error) {
    console.error("[settings] updateCompanySettings failed:", error);
    return mapDomainError(error);
  }
}

export async function updateGeneralSettings(
  formData: FormData,
): Promise<ActionResult> {
  const auth = await requireSettingsWrite();
  if (!("id" in auth)) return auth;

  const parsed = generalSettingsSchema.safeParse({
    defaultLanguage: String(formData.get("defaultLanguage") ?? "en"),
    maintenanceMode: parseBoolean(formData.get("maintenanceMode")),
    seoTitleEn: String(formData.get("seoTitleEn") ?? ""),
    seoTitleAr: String(formData.get("seoTitleAr") ?? ""),
    seoDescriptionEn: String(formData.get("seoDescriptionEn") ?? ""),
    seoDescriptionAr: String(formData.get("seoDescriptionAr") ?? ""),
  });
  if (!parsed.success) {
    return actionError("Validation failed", zodFieldErrors(parsed.error.issues));
  }

  try {
    await settingsService.updateGeneralSettings(
      { userId: auth.id },
      parsed.data,
    );
    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    revalidatePath("/[locale]", "layout");
    revalidatePath("/[locale]", "page");
    return actionOk(undefined, "General settings saved");
  } catch (error) {
    console.error("[settings] updateGeneralSettings failed:", error);
    return mapDomainError(error);
  }
}
