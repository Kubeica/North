import { AuditAction } from "@/lib/audit/actions";
import { SITE_SETTING_KEYS } from "@/lib/settings/keys";
import { auditService } from "@/src/domain/audit/service";
import { settingsRepository } from "@/src/domain/settings/repository";
import type {
  CompanyProfileInput,
  GeneralSettingsInput,
} from "@/src/domain/settings/validation";
import type { DomainActor } from "@/src/domain/shared/actor";
import { DomainError } from "@/src/domain/shared/errors";
import { runTransaction } from "@/src/domain/shared/transaction";

export const settingsService = {
  async getCompany() {
    return settingsRepository.getCompanyProfile();
  },

  /** Alias for public site reads. */
  async getProfileForPublic() {
    return settingsRepository.getCompanyProfile();
  },

  async getSettings(keys: string[]) {
    return settingsRepository.getManySiteSettings(keys);
  },

  async updateCompany(actor: DomainActor, input: CompanyProfileInput) {
    try {
      const profile = await runTransaction(async (tx) => {
        return settingsRepository.upsertCompanyProfile(input, tx);
      });

      await auditService.record(actor, {
        action: AuditAction.UPDATE_COMPANY,
        entity: "CompanyProfile",
        entityId: profile.id,
      });

      return profile;
    } catch {
      throw new DomainError("Failed to save company profile");
    }
  },

  async updateGeneralSettings(actor: DomainActor, input: GeneralSettingsInput) {
    const maintenanceMode = input.maintenanceMode ? "true" : "false";
    const entries = [
      {
        key: SITE_SETTING_KEYS.defaultLanguage,
        value: input.defaultLanguage,
      },
      {
        key: SITE_SETTING_KEYS.maintenanceMode,
        value: maintenanceMode,
      },
      {
        key: SITE_SETTING_KEYS.seoTitleEn,
        value: input.seoTitleEn,
      },
      {
        key: SITE_SETTING_KEYS.seoTitleAr,
        value: input.seoTitleAr,
      },
      {
        key: SITE_SETTING_KEYS.seoDescriptionEn,
        value: input.seoDescriptionEn,
      },
      {
        key: SITE_SETTING_KEYS.seoDescriptionAr,
        value: input.seoDescriptionAr,
      },
    ];

    try {
      await runTransaction(async (tx) => {
        await settingsRepository.upsertManySiteSettings(entries, tx);
      });

      await auditService.record(actor, {
        action: AuditAction.UPDATE_SETTINGS,
        entity: "SiteSetting",
        metadata: {
          defaultLanguage: input.defaultLanguage,
          maintenanceMode,
        },
      });
    } catch {
      throw new DomainError("Failed to save settings");
    }
  },
};
