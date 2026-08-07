import { safeQuery } from "@/lib/data/safe";
import { settingsService } from "@/src/domain/settings/service";

export async function getCompanyProfile() {
  return safeQuery(() => settingsService.getProfileForPublic(), null);
}
