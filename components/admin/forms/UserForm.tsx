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
import { createUser, updateUser } from "@/app/actions/users";
import type { ActionResult } from "@/lib/admin/action";
import type { PublicUser } from "@/types";

type UserFormProps = {
  mode: "create" | "edit";
  initial?: Pick<PublicUser, "id" | "name" | "email" | "role" | "active">;
  /** When editing your own account, Active cannot be turned off. */
  isSelf?: boolean;
};

export function UserForm({ mode, initial, isSelf = false }: UserFormProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      setErrors({});
      try {
        const result: ActionResult<PublicUser> =
          mode === "create"
            ? await createUser(formData)
            : await updateUser(formData);

        if (!result.ok) {
          if (result.fieldErrors) setErrors(result.fieldErrors);
          toast.error(result.error);
          return;
        }

        toast.success(result.message ?? "Saved");
        if (mode === "create") {
          router.push(`/admin/users/${result.data.id}/edit`);
        } else {
          router.refresh();
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to save user",
        );
      }
    });
  }

  return (
    <form action={onSubmit} className="space-y-4">
      {mode === "edit" && initial?.id ? (
        <input type="hidden" name="id" value={initial.id} />
      ) : null}

      <FormSection title="Account">
        <Field label="Name" name="name" error={errors.name}>
          <input
            id="name"
            name="name"
            required
            defaultValue={initial?.name ?? ""}
            className={fieldClassName}
          />
        </Field>
        <Field label="Email" name="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={initial?.email ?? ""}
            className={fieldClassName}
          />
        </Field>
        <Field
          label={mode === "create" ? "Password" : "New password (optional)"}
          name="password"
          error={errors.password}
        >
          <input
            id="password"
            name="password"
            type="password"
            required={mode === "create"}
            minLength={mode === "create" ? 8 : undefined}
            className={fieldClassName}
            autoComplete="new-password"
          />
        </Field>
        <Field label="Role" name="role" error={errors.role}>
          <select
            id="role"
            name="role"
            defaultValue={initial?.role ?? "EDITOR"}
            className={fieldClassName}
          >
            <option value="EDITOR">Editor</option>
            <option value="ADMIN">Admin</option>
          </select>
        </Field>
        {isSelf ? (
          <input type="hidden" name="active" value="true" />
        ) : null}
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            name={isSelf ? undefined : "active"}
            value="true"
            defaultChecked={initial?.active ?? true}
            disabled={isSelf}
            className="size-4 accent-[var(--gold)]"
          />
          Active
          {isSelf ? (
            <span className="text-muted-foreground">
              (you cannot deactivate yourself)
            </span>
          ) : null}
        </label>
      </FormSection>

      <div className="flex justify-end pt-2">
        <SubmitButton
          label={mode === "create" ? "Create user" : "Save user"}
        />
      </div>
    </form>
  );
}
