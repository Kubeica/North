import { redirect } from "next/navigation";

import { SITE_SETTING_KEYS } from "@/lib/settings/keys";
import { PageHeader } from "@/components/admin/PageHeader";
import { SettingsForm } from "@/components/admin/forms/SettingsForm";
import { requireSession } from "@/lib/auth/session";
import { can } from "@/lib/permissions";
import { settingsService } from "@/src/domain/settings/service";

export const metadata = { title: "Settings" };

/** Always read fresh company/settings after saves (auth already dynamic; be explicit). */
export const dynamic = "force-dynamic";

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
        key={company?.updatedAt?.toISOString() ?? "company-new"}
        company={
          company
            ? {
                nameEn: company.nameEn,
                nameAr: company.nameAr,
                shortNameEn: company.shortNameEn,
                shortNameAr: company.shortNameAr,
                shortDescriptionEn: company.shortDescriptionEn,
                shortDescriptionAr: company.shortDescriptionAr,
                aboutEn: company.aboutEn,
                aboutAr: company.aboutAr,
                visionEn: company.visionEn,
                visionAr: company.visionAr,
                missionEn: company.missionEn,
                missionAr: company.missionAr,
                valuesEn: company.valuesEn,
                valuesAr: company.valuesAr,
                experienceEn: company.experienceEn,
                experienceAr: company.experienceAr,
                capabilitiesEn: company.capabilitiesEn,
                capabilitiesAr: company.capabilitiesAr,
                safetyEn: company.safetyEn,
                safetyAr: company.safetyAr,
                qualityEn: company.qualityEn,
                qualityAr: company.qualityAr,
                whyUsEn: company.whyUsEn,
                whyUsAr: company.whyUsAr,
                processEn: company.processEn,
                processAr: company.processAr,
                phone: company.phone,
                email: company.email,
                addressEn: company.addressEn,
                addressAr: company.addressAr,
                latitude: company.latitude,
                longitude: company.longitude,
                logoUrl: company.logoUrl,
                faviconUrl: company.faviconUrl,
                heroImageUrl: company.heroImageUrl,
                linkedinUrl: company.linkedinUrl,
                facebookUrl: company.facebookUrl,
                instagramUrl: company.instagramUrl,
                youtubeUrl: company.youtubeUrl,
              }
            : null
        }
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
