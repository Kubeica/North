"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  Field,
  FormSection,
  fieldClassName,
  textareaClassName,
} from "@/components/admin/FormSection";
import { SubmitButton } from "@/components/admin/SubmitButton";
import {
  updateCompanySettings,
  updateGeneralSettings,
} from "@/app/actions/settings";

type CompanyValues = {
  [key: string]: string | number | boolean | Date | null | undefined;
};

type SettingsFormProps = {
  company: CompanyValues | null;
  settings: {
    defaultLanguage: string;
    maintenanceMode: boolean;
    seoTitleEn: string;
    seoTitleAr: string;
    seoDescriptionEn: string;
    seoDescriptionAr: string;
  };
};

function val(company: CompanyValues | null, key: string) {
  const v = company?.[key];
  return v == null ? "" : String(v);
}

export function SettingsForm({ company, settings }: SettingsFormProps) {
  const [, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onCompanySubmit(formData: FormData) {
    startTransition(async () => {
      setErrors({});
      const result = await updateCompanySettings(formData);
      if (!result.ok) {
        if (result.fieldErrors) setErrors(result.fieldErrors);
        toast.error(result.error);
        return;
      }
      toast.success(result.message ?? "Saved");
    });
  }

  function onGeneralSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updateGeneralSettings(formData);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message ?? "Saved");
    });
  }

  return (
    <div className="space-y-8">
      <form action={onCompanySubmit} className="space-y-4">
        <FormSection title="Company profile">
          <Field label="Name (EN)" name="nameEn" error={errors.nameEn}>
            <input
              id="nameEn"
              name="nameEn"
              required
              defaultValue={val(company, "nameEn")}
              className={fieldClassName}
            />
          </Field>
          <Field label="Name (AR)" name="nameAr" error={errors.nameAr}>
            <input
              id="nameAr"
              name="nameAr"
              required
              dir="rtl"
              defaultValue={val(company, "nameAr")}
              className={fieldClassName}
            />
          </Field>
          <Field label="Short name (EN)" name="shortNameEn">
            <input
              id="shortNameEn"
              name="shortNameEn"
              defaultValue={val(company, "shortNameEn")}
              className={fieldClassName}
            />
          </Field>
          <Field label="Short name (AR)" name="shortNameAr">
            <input
              id="shortNameAr"
              name="shortNameAr"
              dir="rtl"
              defaultValue={val(company, "shortNameAr")}
              className={fieldClassName}
            />
          </Field>
          <Field
            label="Short description (EN)"
            name="shortDescriptionEn"
            full
            error={errors.shortDescriptionEn}
          >
            <textarea
              id="shortDescriptionEn"
              name="shortDescriptionEn"
              required
              defaultValue={val(company, "shortDescriptionEn")}
              className={textareaClassName}
            />
          </Field>
          <Field
            label="Short description (AR)"
            name="shortDescriptionAr"
            full
            error={errors.shortDescriptionAr}
          >
            <textarea
              id="shortDescriptionAr"
              name="shortDescriptionAr"
              required
              dir="rtl"
              defaultValue={val(company, "shortDescriptionAr")}
              className={textareaClassName}
            />
          </Field>
          <Field label="About (EN)" name="aboutEn" full error={errors.aboutEn}>
            <textarea
              id="aboutEn"
              name="aboutEn"
              required
              defaultValue={val(company, "aboutEn")}
              className={textareaClassName}
            />
          </Field>
          <Field label="About (AR)" name="aboutAr" full error={errors.aboutAr}>
            <textarea
              id="aboutAr"
              name="aboutAr"
              required
              dir="rtl"
              defaultValue={val(company, "aboutAr")}
              className={textareaClassName}
            />
          </Field>
          <Field label="Vision (EN)" name="visionEn" full error={errors.visionEn}>
            <textarea
              id="visionEn"
              name="visionEn"
              required
              defaultValue={val(company, "visionEn")}
              className={textareaClassName}
            />
          </Field>
          <Field label="Vision (AR)" name="visionAr" full error={errors.visionAr}>
            <textarea
              id="visionAr"
              name="visionAr"
              required
              dir="rtl"
              defaultValue={val(company, "visionAr")}
              className={textareaClassName}
            />
          </Field>
          <Field
            label="Mission (EN)"
            name="missionEn"
            full
            error={errors.missionEn}
          >
            <textarea
              id="missionEn"
              name="missionEn"
              required
              defaultValue={val(company, "missionEn")}
              className={textareaClassName}
            />
          </Field>
          <Field
            label="Mission (AR)"
            name="missionAr"
            full
            error={errors.missionAr}
          >
            <textarea
              id="missionAr"
              name="missionAr"
              required
              dir="rtl"
              defaultValue={val(company, "missionAr")}
              className={textareaClassName}
            />
          </Field>
        </FormSection>

        <FormSection title="Contact & location">
          <Field label="Phone" name="phone">
            <input
              id="phone"
              name="phone"
              defaultValue={val(company, "phone")}
              className={fieldClassName}
            />
          </Field>
          <Field label="Email" name="email" error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={val(company, "email")}
              className={fieldClassName}
            />
          </Field>
          <Field label="Address (EN)" name="addressEn" full>
            <input
              id="addressEn"
              name="addressEn"
              defaultValue={val(company, "addressEn")}
              className={fieldClassName}
            />
          </Field>
          <Field label="Address (AR)" name="addressAr" full>
            <input
              id="addressAr"
              name="addressAr"
              dir="rtl"
              defaultValue={val(company, "addressAr")}
              className={fieldClassName}
            />
          </Field>
          <Field label="Latitude" name="latitude">
            <input
              id="latitude"
              name="latitude"
              defaultValue={val(company, "latitude")}
              className={fieldClassName}
            />
          </Field>
          <Field label="Longitude" name="longitude">
            <input
              id="longitude"
              name="longitude"
              defaultValue={val(company, "longitude")}
              className={fieldClassName}
            />
          </Field>
        </FormSection>

        <FormSection title="Social & brand media">
          <Field label="Logo URL" name="logoUrl">
            <input
              id="logoUrl"
              name="logoUrl"
              defaultValue={val(company, "logoUrl")}
              className={fieldClassName}
            />
          </Field>
          <Field label="Favicon URL" name="faviconUrl">
            <input
              id="faviconUrl"
              name="faviconUrl"
              defaultValue={val(company, "faviconUrl")}
              className={fieldClassName}
            />
          </Field>
          <Field label="Hero image URL" name="heroImageUrl" full>
            <input
              id="heroImageUrl"
              name="heroImageUrl"
              defaultValue={val(company, "heroImageUrl")}
              className={fieldClassName}
            />
          </Field>
          <Field label="LinkedIn" name="linkedinUrl">
            <input
              id="linkedinUrl"
              name="linkedinUrl"
              defaultValue={val(company, "linkedinUrl")}
              className={fieldClassName}
            />
          </Field>
          <Field label="Facebook" name="facebookUrl">
            <input
              id="facebookUrl"
              name="facebookUrl"
              defaultValue={val(company, "facebookUrl")}
              className={fieldClassName}
            />
          </Field>
          <Field label="Instagram" name="instagramUrl">
            <input
              id="instagramUrl"
              name="instagramUrl"
              defaultValue={val(company, "instagramUrl")}
              className={fieldClassName}
            />
          </Field>
          <Field label="YouTube" name="youtubeUrl">
            <input
              id="youtubeUrl"
              name="youtubeUrl"
              defaultValue={val(company, "youtubeUrl")}
              className={fieldClassName}
            />
          </Field>
        </FormSection>

        <FormSection title="Extended content (optional)">
          {(
            [
              ["valuesEn", "Values (EN)"],
              ["valuesAr", "Values (AR)"],
              ["experienceEn", "Experience (EN)"],
              ["experienceAr", "Experience (AR)"],
              ["capabilitiesEn", "Capabilities (EN)"],
              ["capabilitiesAr", "Capabilities (AR)"],
              ["safetyEn", "Safety (EN)"],
              ["safetyAr", "Safety (AR)"],
              ["qualityEn", "Quality (EN)"],
              ["qualityAr", "Quality (AR)"],
              ["whyUsEn", "Why us (EN)"],
              ["whyUsAr", "Why us (AR)"],
              ["processEn", "Process (EN)"],
              ["processAr", "Process (AR)"],
            ] as const
          ).map(([name, label]) => (
            <Field
              key={name}
              label={label}
              name={name}
              full
              error={errors[name]}
            >
              <textarea
                id={name}
                name={name}
                dir={name.endsWith("Ar") ? "rtl" : undefined}
                defaultValue={val(company, name)}
                className={textareaClassName}
              />
            </Field>
          ))}
        </FormSection>

        <div className="flex justify-end">
          <SubmitButton label="Save company profile" />
        </div>
      </form>

      <form action={onGeneralSubmit} className="space-y-4">
        <FormSection title="SEO defaults">
          <Field label="Default SEO title (EN)" name="seoTitleEn">
            <input
              id="seoTitleEn"
              name="seoTitleEn"
              defaultValue={settings.seoTitleEn}
              className={fieldClassName}
            />
          </Field>
          <Field label="Default SEO title (AR)" name="seoTitleAr">
            <input
              id="seoTitleAr"
              name="seoTitleAr"
              dir="rtl"
              defaultValue={settings.seoTitleAr}
              className={fieldClassName}
            />
          </Field>
          <Field label="Default SEO description (EN)" name="seoDescriptionEn" full>
            <textarea
              id="seoDescriptionEn"
              name="seoDescriptionEn"
              defaultValue={settings.seoDescriptionEn}
              className={textareaClassName}
            />
          </Field>
          <Field label="Default SEO description (AR)" name="seoDescriptionAr" full>
            <textarea
              id="seoDescriptionAr"
              name="seoDescriptionAr"
              dir="rtl"
              defaultValue={settings.seoDescriptionAr}
              className={textareaClassName}
            />
          </Field>
        </FormSection>

        <FormSection title="General">
          <Field label="Default language" name="defaultLanguage">
            <select
              id="defaultLanguage"
              name="defaultLanguage"
              defaultValue={settings.defaultLanguage}
              className={fieldClassName}
            >
              <option value="en">English</option>
              <option value="ar">Arabic</option>
            </select>
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="maintenanceMode"
              value="true"
              defaultChecked={settings.maintenanceMode}
              className="size-4 accent-[var(--gold)]"
            />
            Maintenance mode
          </label>
        </FormSection>

        <div className="flex justify-end">
          <SubmitButton label="Save general settings" />
        </div>
      </form>
    </div>
  );
}
