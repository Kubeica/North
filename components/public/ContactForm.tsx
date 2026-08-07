"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";

import { submitContactMessage } from "@/app/actions/contact";
import { cn } from "@/lib/utils";
import type { ContactActionState } from "@/types";

const initialState: ContactActionState = { ok: false };

function SubmitButton() {
  const t = useTranslations("cta");
  const tForms = useTranslations("forms");
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center rounded-md bg-gold px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-gold-light disabled:opacity-60 sm:w-auto"
    >
      {pending ? tForms("saving") : t("sendMessage")}
    </button>
  );
}

type FieldProps = {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: string;
  rows?: number;
};

function Field({
  id,
  name,
  label,
  placeholder,
  type = "text",
  required,
  error,
  rows,
}: FieldProps) {
  const className = cn(
    "w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-gold/60 focus:ring-1 focus:ring-gold/40",
    error && "border-destructive",
  );

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required ? <span className="text-gold"> *</span> : null}
      </label>
      {rows ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          placeholder={placeholder}
          required={required}
          className={className}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className={className}
        />
      )}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

export function ContactForm() {
  const t = useTranslations("contact");
  const [state, formAction] = useActionState(submitContactMessage, initialState);

  if (state.ok) {
    return (
      <div
        role="status"
        className="rounded-md border border-gold/30 bg-surface px-5 py-8 text-center"
      >
        <p className="text-base text-foreground">{t("success")}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="name"
          name="name"
          label={t("fields.name")}
          placeholder={t("placeholders.name")}
          required
          error={state.fieldErrors?.name}
        />
        <Field
          id="email"
          name="email"
          type="email"
          label={t("fields.email")}
          placeholder={t("placeholders.email")}
          required
          error={state.fieldErrors?.email}
        />
        <Field
          id="phone"
          name="phone"
          type="tel"
          label={t("fields.phone")}
          placeholder={t("placeholders.phone")}
          error={state.fieldErrors?.phone}
        />
        <Field
          id="company"
          name="company"
          label={t("fields.company")}
          placeholder={t("placeholders.company")}
          error={state.fieldErrors?.company}
        />
      </div>
      <Field
        id="subject"
        name="subject"
        label={t("fields.subject")}
        placeholder={t("placeholders.subject")}
        required
        error={state.fieldErrors?.subject}
      />
      <Field
        id="message"
        name="message"
        label={t("fields.message")}
        placeholder={t("placeholders.message")}
        required
        rows={5}
        error={state.fieldErrors?.message}
      />

      {state.error === "rateLimited" ? (
        <p className="text-sm text-destructive" role="alert">
          {t("rateLimited")}
        </p>
      ) : null}
      {state.error === "server" ? (
        <p className="text-sm text-destructive" role="alert">
          {t("error")}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
