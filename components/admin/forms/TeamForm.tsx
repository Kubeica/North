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
import { createTeamMember, updateTeamMember } from "@/app/actions/team";
import type { ActionResult } from "@/lib/admin/action";

type TeamFormValues = {
  id?: string;
  nameAr: string;
  nameEn: string;
  positionAr: string;
  positionEn: string;
  bioAr?: string | null;
  bioEn?: string | null;
  imageUrl?: string | null;
  linkedin?: string | null;
  email?: string | null;
  sortOrder: number;
  published: boolean;
  isDemo: boolean;
};

type TeamFormProps = {
  mode: "create" | "edit";
  initial?: TeamFormValues;
};

const empty: TeamFormValues = {
  nameAr: "",
  nameEn: "",
  positionAr: "",
  positionEn: "",
  sortOrder: 0,
  published: true,
  isDemo: true,
};

export function TeamForm({ mode, initial }: TeamFormProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const values = { ...empty, ...initial };

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      setErrors({});
      const result: ActionResult<{ id: string }> =
        mode === "create"
          ? await createTeamMember(formData)
          : await updateTeamMember(formData);

      if (!result.ok) {
        if (result.fieldErrors) setErrors(result.fieldErrors);
        toast.error(result.error);
        return;
      }

      toast.success(result.message ?? "Saved");
      if (mode === "create") {
        router.push(`/admin/team/${result.data.id}/edit`);
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

      <FormSection title="Profile">
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
        <Field label="Position (EN)" name="positionEn" error={errors.positionEn}>
          <input
            id="positionEn"
            name="positionEn"
            required
            defaultValue={values.positionEn}
            className={fieldClassName}
          />
        </Field>
        <Field label="Position (AR)" name="positionAr" error={errors.positionAr}>
          <input
            id="positionAr"
            name="positionAr"
            required
            dir="rtl"
            defaultValue={values.positionAr}
            className={fieldClassName}
          />
        </Field>
        <MediaPicker
          name="imageUrl"
          label="Photo"
          defaultValue={values.imageUrl ?? ""}
          error={errors.imageUrl}
        />
        <Field label="LinkedIn URL" name="linkedin" error={errors.linkedin}>
          <input
            id="linkedin"
            name="linkedin"
            type="url"
            defaultValue={values.linkedin ?? ""}
            className={fieldClassName}
          />
        </Field>
        <Field label="Email" name="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={values.email ?? ""}
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
      </FormSection>

      <FormSection title="Bio">
        <Field label="Bio (EN)" name="bioEn" full error={errors.bioEn}>
          <textarea
            id="bioEn"
            name="bioEn"
            defaultValue={values.bioEn ?? ""}
            className={textareaClassName}
          />
        </Field>
        <Field label="Bio (AR)" name="bioAr" full error={errors.bioAr}>
          <textarea
            id="bioAr"
            name="bioAr"
            dir="rtl"
            defaultValue={values.bioAr ?? ""}
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
          label={mode === "create" ? "Create member" : "Save member"}
        />
      </div>
    </form>
  );
}
