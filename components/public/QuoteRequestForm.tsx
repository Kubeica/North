"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";

import { submitQuoteRequest } from "@/app/actions/quote-requests";
import { cn } from "@/lib/utils";
import type { QuoteRequestActionState } from "@/types";

const initialState: QuoteRequestActionState = { ok: false };

function SubmitButton() {
  const t = useTranslations("contact.quote");
  const tForms = useTranslations("forms");
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 w-full items-center justify-center bg-gold px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 disabled:opacity-60 sm:w-auto"
    >
      {pending ? tForms("saving") : t("submit")}
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
  autoComplete?: string;
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
  autoComplete,
}: FieldProps) {
  const describedBy = error ? `${id}-error` : undefined;
  const className = cn(
    "w-full border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-gold/60 focus:ring-1 focus:ring-gold/40",
    error && "border-destructive",
  );

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required ? (
          <span className="text-gold" aria-hidden>
            {" "}
            *
          </span>
        ) : null}
      </label>
      {rows ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          placeholder={placeholder}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={className}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={className}
        />
      )}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function QuoteRequestForm() {
  const t = useTranslations("contact");
  const tQuote = useTranslations("contact.quote");
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);
  const [state, action] = useActionState(submitQuoteRequest, initialState);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      successRef.current?.focus();
    }
  }, [state.ok]);

  return (
    <form
      ref={formRef}
      action={action}
      className="space-y-6"
      noValidate
    >
      <div className="sr-only" aria-hidden>
        <label htmlFor={`${formId}-website`}>Website</label>
        <input
          id={`${formId}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {state.ok ? (
        <p
          ref={successRef}
          tabIndex={-1}
          className="border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 outline-none"
          role="status"
        >
          {tQuote("success")}
        </p>
      ) : null}

      {state.error === "rateLimited" ? (
        <p className="border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
          {t("rateLimited")}
        </p>
      ) : null}

      {state.error === "server" ? (
        <p className="border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
          {t("error")}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={`${formId}-company`}
          name="company"
          label={tQuote("fields.company")}
          placeholder={tQuote("placeholders.company")}
          required
          autoComplete="organization"
          error={state.fieldErrors?.company}
        />
        <Field
          id={`${formId}-name`}
          name="name"
          label={tQuote("fields.name")}
          placeholder={tQuote("placeholders.name")}
          required
          autoComplete="name"
          error={state.fieldErrors?.name}
        />
        <Field
          id={`${formId}-email`}
          name="email"
          type="email"
          label={tQuote("fields.email")}
          placeholder={tQuote("placeholders.email")}
          required
          autoComplete="email"
          error={state.fieldErrors?.email}
        />
        <Field
          id={`${formId}-phone`}
          name="phone"
          type="tel"
          label={tQuote("fields.phone")}
          placeholder={tQuote("placeholders.phone")}
          autoComplete="tel"
          error={state.fieldErrors?.phone}
        />
        <Field
          id={`${formId}-projectType`}
          name="projectType"
          label={tQuote("fields.projectType")}
          placeholder={tQuote("placeholders.projectType")}
          required
          error={state.fieldErrors?.projectType}
        />
        <Field
          id={`${formId}-budget`}
          name="budget"
          label={tQuote("fields.budget")}
          placeholder={tQuote("placeholders.budget")}
          error={state.fieldErrors?.budget}
        />
        <Field
          id={`${formId}-location`}
          name="location"
          label={tQuote("fields.location")}
          placeholder={tQuote("placeholders.location")}
          error={state.fieldErrors?.location}
        />
        <Field
          id={`${formId}-timeline`}
          name="timeline"
          label={tQuote("fields.timeline")}
          placeholder={tQuote("placeholders.timeline")}
          error={state.fieldErrors?.timeline}
        />
      </div>

      <Field
        id={`${formId}-message`}
        name="message"
        label={tQuote("fields.message")}
        placeholder={tQuote("placeholders.message")}
        required
        rows={6}
        error={state.fieldErrors?.message}
      />

      <div className="space-y-1.5">
        <label
          htmlFor={`${formId}-attachment`}
          className="text-sm font-medium text-foreground"
        >
          {tQuote("fields.attachment")}
        </label>
        <input
          id={`${formId}-attachment`}
          name="attachment"
          type="file"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          className="block w-full text-sm text-muted-foreground file:me-3 file:border-0 file:bg-surface-2 file:px-3 file:py-2 file:text-sm file:text-foreground"
          aria-describedby={`${formId}-attachment-hint`}
        />
        <p
          id={`${formId}-attachment-hint`}
          className="text-xs text-muted-foreground"
        >
          {tQuote("attachmentHint")}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">{tQuote("privacyNote")}</p>
        <SubmitButton />
      </div>
    </form>
  );
}
