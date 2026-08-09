"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Field,
  FormSection,
  fieldClassName,
} from "@/components/admin/FormSection";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { createStatistic, updateStatistic } from "@/app/actions/statistics";
import type { ActionResult } from "@/lib/admin/action";

type StatisticFormValues = {
  id?: string;
  labelAr: string;
  labelEn: string;
  value: string;
  sortOrder: number;
  published: boolean;
};

type StatisticFormProps = {
  mode: "create" | "edit";
  initial?: StatisticFormValues;
};

const empty: StatisticFormValues = {
  labelAr: "",
  labelEn: "",
  value: "",
  sortOrder: 0,
  published: false,
};

export function StatisticForm({ mode, initial }: StatisticFormProps) {
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
            ? await createStatistic(formData)
            : await updateStatistic(formData);

        if (!result.ok) {
          if (result.fieldErrors) setErrors(result.fieldErrors);
          toast.error(result.error);
          return;
        }

        toast.success(result.message ?? "Saved");
        if (mode === "create") {
          router.push(`/admin/statistics/${result.data.id}/edit`);
        } else {
          router.refresh();
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to save statistic",
        );
      }
    });
  }

  return (
    <form action={onSubmit} className="space-y-4">
      {mode === "edit" && values.id ? (
        <input type="hidden" name="id" value={values.id} />
      ) : null}

      <FormSection title="Statistic">
        <Field label="Value" name="value" error={errors.value}>
          <input
            id="value"
            name="value"
            required
            defaultValue={values.value}
            className={fieldClassName}
            placeholder="e.g. 25+"
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
        <Field label="Label (EN)" name="labelEn" error={errors.labelEn}>
          <input
            id="labelEn"
            name="labelEn"
            required
            defaultValue={values.labelEn}
            className={fieldClassName}
          />
        </Field>
        <Field label="Label (AR)" name="labelAr" error={errors.labelAr}>
          <input
            id="labelAr"
            name="labelAr"
            required
            dir="rtl"
            defaultValue={values.labelAr}
            className={fieldClassName}
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
        <p className="text-xs text-muted-foreground">
          Leave unpublished until real values are ready. Empty published lists
          hide the public statistics section.
        </p>
      </FormSection>

      <div className="flex justify-end pt-2">
        <SubmitButton
          label={mode === "create" ? "Create statistic" : "Save statistic"}
        />
      </div>
    </form>
  );
}
