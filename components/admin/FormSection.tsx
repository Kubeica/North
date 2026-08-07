import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-surface/50 p-4 sm:p-5",
        className,
      )}
    >
      <div className="mb-4 border-b border-border pb-3">
        <h2 className="text-sm font-semibold tracking-wide text-gold">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

type FieldProps = {
  label: string;
  name: string;
  error?: string;
  children: ReactNode;
  className?: string;
  full?: boolean;
};

export function Field({
  label,
  name,
  error,
  children,
  className,
  full,
}: FieldProps) {
  return (
    <label
      className={cn("flex flex-col gap-1.5", full && "sm:col-span-2", className)}
      htmlFor={name}
    >
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
    </label>
  );
}

export const fieldClassName =
  "h-9 w-full rounded-lg border border-border bg-background/50 px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50";

export const textareaClassName =
  "min-h-24 w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50";
