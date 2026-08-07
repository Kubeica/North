import { cn } from "@/components/public/theme/utils";

const STATUS_STYLES: Record<string, string> = {
  PLANNED: "border-border/70 bg-muted/40 text-muted-foreground",
  IN_PROGRESS: "border-gold/35 bg-gold/10 text-gold-light",
  COMPLETED: "border-emerald-500/35 bg-emerald-500/10 text-emerald-300",
  ON_HOLD: "border-amber-500/35 bg-amber-500/10 text-amber-300",
};

type ProjectStatusBadgeProps = {
  status: string;
  label: string;
  className?: string;
};

/** Public portfolio status badge (distinct from admin `StatusBadge`). */
export function ProjectStatusBadge({
  status,
  label,
  className,
}: ProjectStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium tracking-wide",
        STATUS_STYLES[status] ??
          "border-border/70 bg-muted/40 text-muted-foreground",
        className,
      )}
    >
      {label}
    </span>
  );
}
