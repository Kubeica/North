import { EmptyState } from "@/components/admin/EmptyState";
import { cn, formatDate } from "@/lib/utils";

export type AuditEntry = {
  id?: string;
  action: string;
  entity?: string | null;
  userName?: string | null;
  createdAt: string | Date;
};

type AuditPanelProps = {
  entries: AuditEntry[];
  title?: string;
  emptyMessage?: string;
  /** When true, skip the outer card chrome (for nesting inside DashboardCard). */
  bare?: boolean;
  className?: string;
};

/** Presentational list of recent audit events. */
export function AuditPanel({
  entries,
  title = "Recent activity",
  emptyMessage = "No audit activity",
  bare = false,
  className,
}: AuditPanelProps) {
  const list =
    entries.length === 0 ? (
      <EmptyState title={emptyMessage} className="py-8" />
    ) : (
      <ul className="divide-y divide-border">
        {entries.map((entry, index) => (
          <li
            key={entry.id ?? `${entry.action}-${String(entry.createdAt)}-${index}`}
            className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="truncate text-sm text-foreground">
                <span className="font-medium text-gold-light">{entry.action}</span>
                {entry.entity ? (
                  <span className="text-muted-foreground"> · {entry.entity}</span>
                ) : null}
              </p>
              <p className="text-xs text-muted-foreground">
                {entry.userName ?? "System"}
              </p>
            </div>
            <time className="shrink-0 text-xs text-muted-foreground">
              {formatDate(entry.createdAt, "PPp")}
            </time>
          </li>
        ))}
      </ul>
    );

  if (bare) {
    return <div className={className}>{list}</div>;
  }

  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-surface/50 p-4 sm:p-5",
        className,
      )}
    >
      <h2 className="mb-3 text-sm font-semibold tracking-wide text-gold">
        {title}
      </h2>
      {list}
    </section>
  );
}
