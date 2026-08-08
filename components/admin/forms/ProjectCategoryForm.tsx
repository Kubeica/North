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
import { SubmitButton } from "@/components/admin/SubmitButton";
import {
  createProjectCategory,
  updateProjectCategory,
} from "@/app/actions/project-categories";
import type { ActionResult } from "@/lib/admin/action";

type ProjectCategoryFormValues = {
  id?: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string | null;
  descriptionEn?: string | null;
  sortOrder: number;
  published: boolean;
};

type ProjectCategoryFormProps = {
  mode: "create" | "edit";
  initial?: ProjectCategoryFormValues;
};

const empty: ProjectCategoryFormValues = {
  slug: "",
  nameAr: "",
  nameEn: "",
  sortOrder: 0,
  published: true,
};

export function ProjectCategoryForm({
  mode,
  initial,
}: ProjectCategoryFormProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const values = { ...empty, ...initial };

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      setErrors({});
      const result: ActionResult<{ id: string }> =
        mode === "create"
          ? await createProjectCategory(formData)
          : await updateProjectCategory(formData);

      if (!result.ok) {
        if (result.fieldErrors) setErrors(result.fieldErrors);
        toast.error(result.error);
        return;
      }

      toast.success(result.message ?? "Saved");
      if (mode === "create") {
        router.push(`/admin/project-categories/${result.data.id}/edit`);
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

      <FormSection title="Category">
        <Field label="English name" name="nameEn" error={errors.nameEn}>
          <input
            id="nameEn"
            name="nameEn"
            required
            defaultValue={values.nameEn}
            className={fieldClassName}
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
            placeholder="residential"
          />
        </Field>
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
        <Field
          label="Description (EN)"
          name="descriptionEn"
          full
          error={errors.descriptionEn}
        >
          <textarea
            id="descriptionEn"
            name="descriptionEn"
            defaultValue={values.descriptionEn ?? ""}
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
            dir="rtl"
            defaultValue={values.descriptionAr ?? ""}
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
      </FormSection>

      <div className="flex justify-end pt-2">
        <SubmitButton
          label={mode === "create" ? "Create category" : "Save category"}
        />
      </div>
    </form>
  );
}
