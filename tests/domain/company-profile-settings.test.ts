import { describe, expect, it } from "vitest";

import {
  parseOptionalString,
  zodFieldErrors,
} from "@/lib/admin/action";
import { companyProfileSchema } from "@/src/domain/settings/validation";

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

function fd(entries: Record<string, string>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    formData.set(key, value);
  }
  return formData;
}

const baseFields = {
  nameEn: "Northern Meteor",
  nameAr: "النيزك الشمالي",
  shortDescriptionEn: "Short EN",
  shortDescriptionAr: "وصف قصير",
  aboutEn: "About EN",
  aboutAr: "حول",
  visionEn: "Vision EN",
  visionAr: "رؤية",
  missionEn: "Mission EN",
  missionAr: "رسالة",
  phone: "+964 750 231 1521",
  email: "",
  addressEn: "Erbil",
  addressAr: "أربيل",
  latitude: "36.18181364663723",
  longitude: "43.97890180239019",
  logoUrl: "/images/logo.png",
  faviconUrl: "",
  heroImageUrl: "",
  linkedinUrl: "",
  facebookUrl: "",
  instagramUrl: "",
  youtubeUrl: "",
};

describe("company profile settings payload", () => {
  it("accepts a full realistic save payload", () => {
    const parsed = companyProfileSchema.safeParse(
      formToCompanyPayload(fd(baseFields)),
    );
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.nameEn).toBe("Northern Meteor");
    expect(parsed.data.latitude).toBeCloseTo(36.18181364663723);
    expect(parsed.data.longitude).toBeCloseTo(43.97890180239019);
    expect(parsed.data.logoUrl).toBe("/images/logo.png");
  });

  it("clears coordinates when empty strings are submitted", () => {
    const parsed = companyProfileSchema.safeParse(
      formToCompanyPayload(
        fd({ ...baseFields, latitude: "", longitude: "" }),
      ),
    );
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.latitude).toBeNull();
    expect(parsed.data.longitude).toBeNull();
  });

  it("rejects invalid social URLs with field errors", () => {
    const parsed = companyProfileSchema.safeParse(
      formToCompanyPayload(
        fd({ ...baseFields, linkedinUrl: "linkedin.com/company/x" }),
      ),
    );
    expect(parsed.success).toBe(false);
    if (parsed.success) return;
    const fieldErrors = zodFieldErrors(parsed.error.issues);
    expect(fieldErrors.linkedinUrl).toBe("Invalid URL");
  });

  it("accepts a single-field-style change while keeping required fields", () => {
    const parsed = companyProfileSchema.safeParse(
      formToCompanyPayload(
        fd({ ...baseFields, nameEn: "Updated Name EN Only" }),
      ),
    );
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.nameEn).toBe("Updated Name EN Only");
  });
});
