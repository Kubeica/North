import type { ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type DashboardCardAction = {
  href: string;
  label: string;
};

type DashboardCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  /** Preferred action shape */
  action?: DashboardCardAction;
  /** Legacy props — still supported */
  actionHref?: string;
  actionLabel?: string;
  className?: string;
};

/** Titled panel for dashboard sections. */
export function DashboardCard({
  title,
  description,
  children,
  action,
  actionHref,
  actionLabel = "View all",
  className,
}: DashboardCardProps) {
  const resolved = action ?? (actionHref ? { href: actionHref, label: actionLabel } : null);

  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-surface/50 p-4 sm:p-5",
        className,
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-wide text-gold">
            {title}
          </h2>
          {description ? (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {resolved ? (
          <Link
            href={resolved.href}
            className="shrink-0 text-xs text-muted-foreground transition-colors hover:text-gold"
          >
            {resolved.label}
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
