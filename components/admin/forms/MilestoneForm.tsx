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
  createCompanyMilestone,
  updateCompanyMilestone,
} from "@/app/actions/milestone";
import type { ActionResult } from "@/lib/admin/action";

type MilestoneFormValues = {
  id?: string;
  year: number;
  titleAr: string;
  titleEn: string;
  descriptionAr?: string | null;
  descriptionEn?: string | null;
  sortOrder: number;
  published: boolean;
};

type MilestoneFormProps = {
  mode: "create" | "edit";
  initial?: MilestoneFormValues;
};

const empty: MilestoneFormValues = {
  year: new Date().getFullYear(),
  titleAr: "",
  titleEn: "",
  sortOrder: 0,
  published: true,
};

export function MilestoneForm({ mode, initial }: MilestoneFormProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const values = { ...empty, ...initial };

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      setErrors({});
      const result: ActionResult<{ id: string }> =
        mode === "create"
          ? await createCompanyMilestone(formData)
          : await updateCompanyMilestone(formData);

      if (!result.ok) {
        if (result.fieldErrors) setErrors(result.fieldErrors);
        toast.error(result.error);
        return;
      }

      toast.success(result.message ?? "Saved");
      if (mode === "create") {
        router.push(`/admin/milestones/${result.data.id}/edit`);
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

      <FormSection title="Milestone">
        <Field label="Year" name="year" error={errors.year}>
          <input
            id="year"
            name="year"
            type="number"
            min={1900}
            max={2100}
            required
            defaultValue={values.year}
            className={fieldClassName}
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
        <Field label="Title (EN)" name="titleEn" error={errors.titleEn} full>
          <input
            id="titleEn"
            name="titleEn"
            required
            defaultValue={values.titleEn}
            className={fieldClassName}
          />
        </Field>
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
      </FormSection>

      <FormSection title="Description">
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
          label={mode === "create" ? "Create milestone" : "Save milestone"}
        />
      </div>
    </form>
  );
}
