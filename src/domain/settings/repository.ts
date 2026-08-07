import { prisma, type Prisma } from "@/src/domain/shared/prisma";
import type { CompanyProfileInput } from "@/src/domain/settings/validation";

type Db = Prisma.TransactionClient | typeof prisma;

function toCompanyData(
  input: CompanyProfileInput,
): Prisma.CompanyProfileCreateInput {
  return {
    nameAr: input.nameAr,
    nameEn: input.nameEn,
    shortNameAr: input.shortNameAr ?? null,
    shortNameEn: input.shortNameEn ?? null,
    shortDescriptionAr: input.shortDescriptionAr,
    shortDescriptionEn: input.shortDescriptionEn,
    aboutAr: input.aboutAr,
    aboutEn: input.aboutEn,
    visionAr: input.visionAr,
    visionEn: input.visionEn,
    missionAr: input.missionAr,
    missionEn: input.missionEn,
    valuesAr: input.valuesAr ?? null,
    valuesEn: input.valuesEn ?? null,
    experienceAr: input.experienceAr ?? null,
    experienceEn: input.experienceEn ?? null,
    capabilitiesAr: input.capabilitiesAr ?? null,
    capabilitiesEn: input.capabilitiesEn ?? null,
    safetyAr: input.safetyAr ?? null,
    safetyEn: input.safetyEn ?? null,
    qualityAr: input.qualityAr ?? null,
    qualityEn: input.qualityEn ?? null,
    whyUsAr: input.whyUsAr ?? null,
    whyUsEn: input.whyUsEn ?? null,
    processAr: input.processAr ?? null,
    processEn: input.processEn ?? null,
    phone: input.phone ?? null,
    email: input.email ?? null,
    addressAr: input.addressAr ?? null,
    addressEn: input.addressEn ?? null,
    latitude: input.latitude ?? null,
    longitude: input.longitude ?? null,
    logoUrl: input.logoUrl ?? null,
    faviconUrl: input.faviconUrl ?? null,
    linkedinUrl: input.linkedinUrl ?? null,
    facebookUrl: input.facebookUrl ?? null,
    instagramUrl: input.instagramUrl ?? null,
    youtubeUrl: input.youtubeUrl ?? null,
    heroImageUrl: input.heroImageUrl ?? null,
  };
}

export const settingsRepository = {
  async getCompanyProfile(db: Db = prisma) {
    return db.companyProfile.findFirst({
      orderBy: { createdAt: "asc" },
    });
  },

  async createCompanyProfile(input: CompanyProfileInput, db: Db = prisma) {
    return db.companyProfile.create({ data: toCompanyData(input) });
  },

  async updateCompanyProfile(
    id: string,
    input: CompanyProfileInput,
    db: Db = prisma,
  ) {
    return db.companyProfile.update({
      where: { id },
      data: toCompanyData(input),
    });
  },

  async upsertCompanyProfile(input: CompanyProfileInput, db: Db = prisma) {
    const existing = await this.getCompanyProfile(db);
    if (existing) {
      return this.updateCompanyProfile(existing.id, input, db);
    }
    return this.createCompanyProfile(input, db);
  },

  async upsertSiteSetting(key: string, value: string, db: Db = prisma) {
    return db.siteSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  },

  async getManySiteSettings(keys: string[], db: Db = prisma) {
    return db.siteSetting.findMany({
      where: { key: { in: keys } },
    });
  },

  async upsertManySiteSettings(
    entries: { key: string; value: string }[],
    db: Db = prisma,
  ) {
    for (const entry of entries) {
      await this.upsertSiteSetting(entry.key, entry.value, db);
    }
  },
};
