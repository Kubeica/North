import { redirect } from "next/navigation";

import { SITE_SETTING_KEYS } from "@/lib/settings/keys";
import { PageHeader } from "@/components/admin/PageHeader";
import { SettingsForm } from "@/components/admin/forms/SettingsForm";
import { requireSession } from "@/lib/auth/session";
import { can } from "@/lib/permissions";
import { settingsService } from "@/src/domain/settings/service";

export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const user = await requireSession();
  if (!can(user.role, "settings:read")) redirect("/admin/dashboard");

  const [company, settings] = await Promise.all([
    settingsService.getCompany(),
    settingsService.getSettings(Object.values(SITE_SETTING_KEYS)),
  ]);

  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Settings"
        description="Company profile, social links, SEO defaults, and general site options."
      />
      <SettingsForm
        company={company}
        settings={{
          defaultLanguage: map[SITE_SETTING_KEYS.defaultLanguage] ?? "en",
          maintenanceMode:
            map[SITE_SETTING_KEYS.maintenanceMode] === "true",
          seoTitleEn: map[SITE_SETTING_KEYS.seoTitleEn] ?? "",
          seoTitleAr: map[SITE_SETTING_KEYS.seoTitleAr] ?? "",
          seoDescriptionEn: map[SITE_SETTING_KEYS.seoDescriptionEn] ?? "",
          seoDescriptionAr: map[SITE_SETTING_KEYS.seoDescriptionAr] ?? "",
        }}
      />
    </div>
  );
}
