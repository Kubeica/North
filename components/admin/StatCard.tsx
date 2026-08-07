import type { ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: ReactNode;
  href?: string;
  icon?: ReactNode;
  hint?: string;
  className?: string;
};

export function StatCard({
  label,
  value,
  href,
  icon,
  hint,
  className,
}: StatCardProps) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        {icon ? (
          <span className="text-gold/80 [&_svg]:size-4">{icon}</span>
        ) : null}
      </div>
      <p className="mt-2 font-heading text-3xl font-semibold text-gold">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </>
  );

  const classes = cn(
    "rounded-xl border border-border bg-surface/60 p-4 transition-colors",
    href && "hover:border-gold/40 hover:bg-surface",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}
