import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FormCardProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  /** When true, children use a 2-col grid on sm+. Default true. */
  grid?: boolean;
};

/** Card container for form field groups (lighter than FormSection gold heading). */
export function FormCard({
  title,
  description,
  children,
  className,
  grid = true,
}: FormCardProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-surface/50 p-4 sm:p-5",
        className,
      )}
    >
      {title || description ? (
        <div className="mb-4 border-b border-border pb-3">
          {title ? (
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          ) : null}
          {description ? (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
      ) : null}
      <div className={cn(grid && "grid gap-4 sm:grid-cols-2")}>{children}</div>
    </section>
  );
}
