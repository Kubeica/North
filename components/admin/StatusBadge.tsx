import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  PLANNED: "border-border bg-muted text-muted-foreground",
  IN_PROGRESS: "border-gold/30 bg-gold/15 text-gold-light",
  COMPLETED: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
  ON_HOLD: "border-amber-500/30 bg-amber-500/15 text-amber-300",
  UNREAD: "border-gold/30 bg-gold/15 text-gold-light",
  READ: "border-border bg-muted text-muted-foreground",
  ARCHIVED: "border-border bg-muted/60 text-muted-foreground/80",
  PUBLISHED: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
  DRAFT: "border-border bg-muted text-muted-foreground",
  ACTIVE: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
  INACTIVE: "border-destructive/30 bg-destructive/10 text-destructive",
  ADMIN: "border-gold/30 bg-gold/15 text-gold-light",
  EDITOR: "border-border bg-muted text-muted-foreground",
  NEW: "border-gold/30 bg-gold/15 text-gold-light",
  IN_REVIEW: "border-sky-500/30 bg-sky-500/15 text-sky-300",
  CONTACTED: "border-violet-500/30 bg-violet-500/15 text-violet-300",
  WON: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
  LOST: "border-destructive/30 bg-destructive/10 text-destructive",
};

const LABELS: Record<string, string> = {
  PLANNED: "Planned",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  ON_HOLD: "On hold",
  UNREAD: "Unread",
  READ: "Read",
  ARCHIVED: "Archived",
  PUBLISHED: "Published",
  DRAFT: "Draft",
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  ADMIN: "Admin",
  EDITOR: "Editor",
  NEW: "New",
  IN_REVIEW: "In review",
  CONTACTED: "Contacted",
  WON: "Won",
  LOST: "Lost",
};

type StatusBadgeProps = {
  status: string;
  className?: string;
  label?: string;
};

export function StatusBadge({ status, className, label }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-md font-normal",
        STATUS_STYLES[status] ?? "border-border bg-muted text-muted-foreground",
        className,
      )}
    >
      {label ?? LABELS[status] ?? status}
    </Badge>
  );
}
