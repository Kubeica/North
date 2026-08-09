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
import { createClient, updateClient } from "@/app/actions/clients";
import type { ActionResult } from "@/lib/admin/action";

type ClientFormValues = {
  id?: string;
  name: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  descriptionAr?: string | null;
  descriptionEn?: string | null;
  sortOrder: number;
  published: boolean;
};

type ClientFormProps = {
  mode: "create" | "edit";
  initial?: ClientFormValues;
};

const empty: ClientFormValues = {
  name: "",
  sortOrder: 0,
  published: true,
};

export function ClientForm({ mode, initial }: ClientFormProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const values = { ...empty, ...initial };

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      setErrors({});
      try {
        const result: ActionResult<{ id: string }> =
          mode === "create"
            ? await createClient(formData)
            : await updateClient(formData);

        if (!result.ok) {
          if (result.fieldErrors) setErrors(result.fieldErrors);
          toast.error(result.error);
          return;
        }

        toast.success(result.message ?? "Saved");
        if (mode === "create") {
          router.push(`/admin/clients/${result.data.id}/edit`);
        } else {
          router.refresh();
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to save client",
        );
      }
    });
  }

  return (
    <form action={onSubmit} className="space-y-4">
      {mode === "edit" && values.id ? (
        <input type="hidden" name="id" value={values.id} />
      ) : null}

      <FormSection title="Client details">
        <Field label="Name" name="name" error={errors.name}>
          <input
            id="name"
            name="name"
            required
            defaultValue={values.name}
            className={fieldClassName}
          />
        </Field>
        <Field label="Website URL" name="websiteUrl" error={errors.websiteUrl}>
          <input
            id="websiteUrl"
            name="websiteUrl"
            defaultValue={values.websiteUrl ?? ""}
            className={fieldClassName}
          />
        </Field>
        <MediaPicker
          name="logoUrl"
          label="Logo"
          defaultValue={values.logoUrl ?? ""}
          error={errors.logoUrl}
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
          label={mode === "create" ? "Create client" : "Save client"}
        />
      </div>
    </form>
  );
}
