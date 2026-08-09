"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createProject, updateProject } from "@/app/actions/projects";
import {
  Field,
  FormCard,
  FormSection,
  GalleryUploader,
  ImageUploader,
  LanguageTabs,
  SaveBar,
  SeoPanel,
  fieldClassName,
  textareaClassName,
} from "@/components/admin";
import type { ActionResult } from "@/lib/admin/action";
import { slugify } from "@/lib/utils";

type Option = { id: string; label: string };

type ProjectFormValues = {
  id?: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  summaryAr?: string | null;
  summaryEn?: string | null;
  descriptionAr: string;
  descriptionEn: string;
  locationAr?: string | null;
  locationEn?: string | null;
  coverImageUrl?: string | null;
  clientId?: string | null;
  categoryId?: string | null;
  status: string;
  startDate?: string | null;
  completionDate?: string | null;
  featured: boolean;
  published: boolean;
  seoTitleAr?: string | null;
  seoTitleEn?: string | null;
  seoDescriptionAr?: string | null;
  seoDescriptionEn?: string | null;
  scopeAr?: string | null;
  scopeEn?: string | null;
  isDemo: boolean;
  galleryUrls?: string;
};

type ProjectFormProps = {
  mode: "create" | "edit";
  initial?: ProjectFormValues;
  categories: Option[];
  clients: Option[];
};

const empty: ProjectFormValues = {
  slug: "",
  titleAr: "",
  titleEn: "",
  descriptionAr: "",
  descriptionEn: "",
  status: "PLANNED",
  featured: false,
  published: false,
  isDemo: true,
  galleryUrls: "",
};

export function ProjectForm({
  mode,
  initial,
  categories,
  clients,
}: ProjectFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const values = { ...empty, ...initial };

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      setErrors({});
      try {
        const result: ActionResult<{ id: string }> =
          mode === "create"
            ? await createProject(formData)
            : await updateProject(formData);

        if (!result.ok) {
          if (result.fieldErrors) setErrors(result.fieldErrors);
          toast.error(result.error);
          return;
        }

        toast.success(result.message ?? "Saved");
        if (mode === "create") {
          router.push(`/admin/projects/${result.data.id}/edit`);
        } else {
          router.refresh();
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to save project",
        );
      }
    });
  }

  return (
    <form action={onSubmit} className="space-y-4 pb-20">
      {mode === "edit" && values.id ? (
        <input type="hidden" name="id" value={values.id} />
      ) : null}

      <FormSection title="Basic information" description="Identity and relations">
        <Field label="Slug" name="slug" error={errors.slug}>
          <input
            id="slug"
            name="slug"
            required
            defaultValue={values.slug}
            className={fieldClassName}
          />
        </Field>
        <Field label="Status" name="status" error={errors.status}>
          <select
            id="status"
            name="status"
            defaultValue={values.status}
            className={fieldClassName}
          >
            <option value="PLANNED">Planned</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="ON_HOLD">On hold</option>
          </select>
        </Field>
        <Field label="Client" name="clientId" error={errors.clientId}>
          <select
            id="clientId"
            name="clientId"
            defaultValue={values.clientId ?? ""}
            className={fieldClassName}
          >
            <option value="">— None —</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Category" name="categoryId" error={errors.categoryId}>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={values.categoryId ?? ""}
            className={fieldClassName}
          >
            <option value="">— None —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Start date" name="startDate" error={errors.startDate}>
          <input
            id="startDate"
            name="startDate"
            type="date"
            defaultValue={values.startDate ?? ""}
            className={fieldClassName}
          />
        </Field>
        <Field
          label="Completion date"
          name="completionDate"
          error={errors.completionDate}
        >
          <input
            id="completionDate"
            name="completionDate"
            type="date"
            defaultValue={values.completionDate ?? ""}
            className={fieldClassName}
          />
        </Field>
      </FormSection>

      <FormCard title="Localized content">
        <div className="sm:col-span-2">
          <LanguageTabs
            english={
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Title (EN)" name="titleEn" error={errors.titleEn} full>
                  <input
                    id="titleEn"
                    name="titleEn"
                    required
                    defaultValue={values.titleEn}
                    className={fieldClassName}
                    onBlur={(e) => {
                      const slugInput = document.getElementById(
                        "slug",
                      ) as HTMLInputElement | null;
                      if (slugInput && !slugInput.value) {
                        slugInput.value = slugify(e.target.value);
                      }
                    }}
                  />
                </Field>
                <Field label="Location (EN)" name="locationEn" error={errors.locationEn}>
                  <input
                    id="locationEn"
                    name="locationEn"
                    defaultValue={values.locationEn ?? ""}
                    className={fieldClassName}
                  />
                </Field>
                <Field label="Summary (EN)" name="summaryEn" full error={errors.summaryEn}>
                  <textarea
                    id="summaryEn"
                    name="summaryEn"
                    defaultValue={values.summaryEn ?? ""}
                    className={textareaClassName}
                  />
                </Field>
                <Field
                  label="Description (EN)"
                  name="descriptionEn"
                  full
                  error={errors.descriptionEn}
                >
                  <textarea
                    id="descriptionEn"
                    name="descriptionEn"
                    required
                    defaultValue={values.descriptionEn}
                    className={textareaClassName}
                  />
                </Field>
                <Field label="Scope (EN)" name="scopeEn" full error={errors.scopeEn}>
                  <textarea
                    id="scopeEn"
                    name="scopeEn"
                    defaultValue={values.scopeEn ?? ""}
                    className={textareaClassName}
                  />
                </Field>
              </div>
            }
            arabic={
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Title (AR)" name="titleAr" error={errors.titleAr} full>
                  <input
                    id="titleAr"
                    name="titleAr"
                    required
                    dir="rtl"
                    defaultValue={values.titleAr}
                    className={fieldClassName}
                  />
                </Field>
                <Field label="Location (AR)" name="locationAr" error={errors.locationAr}>
                  <input
                    id="locationAr"
                    name="locationAr"
                    dir="rtl"
                    defaultValue={values.locationAr ?? ""}
                    className={fieldClassName}
                  />
                </Field>
                <Field label="Summary (AR)" name="summaryAr" full error={errors.summaryAr}>
                  <textarea
                    id="summaryAr"
                    name="summaryAr"
                    dir="rtl"
                    defaultValue={values.summaryAr ?? ""}
                    className={textareaClassName}
                  />
                </Field>
                <Field
                  label="Description (AR)"
                  name="descriptionAr"
                  full
                  error={errors.descriptionAr}
                >
                  <textarea
                    id="descriptionAr"
                    name="descriptionAr"
                    required
                    dir="rtl"
                    defaultValue={values.descriptionAr}
                    className={textareaClassName}
                  />
                </Field>
                <Field label="Scope (AR)" name="scopeAr" full error={errors.scopeAr}>
                  <textarea
                    id="scopeAr"
                    name="scopeAr"
                    dir="rtl"
                    defaultValue={values.scopeAr ?? ""}
                    className={textareaClassName}
                  />
                </Field>
              </div>
            }
          />
        </div>
      </FormCard>

      <FormCard title="Images">
        <div className="sm:col-span-2 space-y-4">
          <ImageUploader
            name="coverImageUrl"
            label="Cover image"
            defaultValue={values.coverImageUrl ?? ""}
            error={errors.coverImageUrl}
            enableUpload
          />
          <GalleryUploader
            name="galleryUrls"
            label="Gallery"
            defaultValue={values.galleryUrls ?? ""}
            mode="chips"
          />
        </div>
      </FormCard>

      <SeoPanel
        seoTitleAr={values.seoTitleAr}
        seoTitleEn={values.seoTitleEn}
        seoDescriptionAr={values.seoDescriptionAr}
        seoDescriptionEn={values.seoDescriptionEn}
        errors={errors}
      />

      <FormSection title="Publishing">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="featured"
            value="true"
            defaultChecked={values.featured}
            className="size-4 accent-[var(--gold)]"
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="published"
            value="true"
            defaultChecked={values.published}
            className="size-4 accent-[var(--gold)]"
          />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isDemo"
            value="true"
            defaultChecked={values.isDemo}
            className="size-4 accent-[var(--gold)]"
          />
          Demo content
        </label>
      </FormSection>

      <SaveBar
        pending={pending}
        saveLabel={mode === "create" ? "Create project" : "Save project"}
        onCancel={() => router.push("/admin/projects")}
        cancelLabel="Back to list"
      />
    </form>
  );
}
