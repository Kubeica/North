"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Field,
  FormSection,
  fieldClassName,
  textareaClassName,
} from "@/components/admin/FormSection";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { createService, updateService } from "@/app/actions/services";
import type { ActionResult } from "@/lib/admin/action";
import { slugify } from "@/lib/utils";

type ServiceFormValues = {
  id?: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
  published: boolean;
  isDemo: boolean;
};

type ServiceFormProps = {
  mode: "create" | "edit";
  initial?: ServiceFormValues;
};

const empty: ServiceFormValues = {
  slug: "",
  nameAr: "",
  nameEn: "",
  descriptionAr: "",
  descriptionEn: "",
  sortOrder: 0,
  published: true,
  isDemo: true,
};

export function ServiceForm({ mode, initial }: ServiceFormProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const values = { ...empty, ...initial };

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      setErrors({});
      const result: ActionResult<{ id: string }> =
        mode === "create"
          ? await createService(formData)
          : await updateService(formData);

      if (!result.ok) {
        if (result.fieldErrors) setErrors(result.fieldErrors);
        toast.error(result.error);
        return;
      }

      toast.success(result.message ?? "Saved");
      if (mode === "create") {
        router.push(`/admin/services/${result.data.id}/edit`);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <form action={onSubmit} className="space-y-4">
      {mode === "edit" && values.id ? (
        <input type="hidden" name="id" value={values.id} />
      ) : null}

      <FormSection title="Basic">
        <Field label="English name" name="nameEn" error={errors.nameEn}>
          <input
            id="nameEn"
            name="nameEn"
            required
            defaultValue={values.nameEn}
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
        <Field label="Arabic name" name="nameAr" error={errors.nameAr}>
          <input
            id="nameAr"
            name="nameAr"
            required
            dir="rtl"
            defaultValue={values.nameAr}
            className={fieldClassName}
          />
        </Field>
        <Field label="Slug" name="slug" error={errors.slug}>
          <input
            id="slug"
            name="slug"
            required
            defaultValue={values.slug}
            className={fieldClassName}
          />
        </Field>
        <Field label="Icon" name="icon" error={errors.icon}>
          <input
            id="icon"
            name="icon"
            defaultValue={values.icon ?? ""}
            className={fieldClassName}
            placeholder="e.g. building"
          />
        </Field>
        <MediaPicker
          name="imageUrl"
          label="Image"
          defaultValue={values.imageUrl ?? ""}
          error={errors.imageUrl}
        />
        <Field label="Sort order" name="sortOrder" error={errors.sortOrder}>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            min={0}
            defaultValue={values.sortOrder}
            className={fieldClassName}
          />
        </Field>
      </FormSection>

      <FormSection title="Content">
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
      </FormSection>

      <FormSection title="Publishing">
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

      <div className="flex justify-end pt-2">
        <SubmitButton
          label={mode === "create" ? "Create service" : "Save service"}
        />
      </div>
    </form>
  );
}
