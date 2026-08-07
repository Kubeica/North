import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type LoadingStateProps = {
  rows?: number;
  className?: string;
  variant?: "table" | "cards" | "form";
};

/** Skeleton placeholders for admin list/editor loading UI. */
export function LoadingState({
  rows = 5,
  className,
  variant = "table",
}: LoadingStateProps) {
  if (variant === "cards") {
    return (
      <div
        className={cn(
          "grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
          className,
        )}
      >
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  if (variant === "form") {
    return (
      <div className={cn("space-y-4", className)}>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "space-y-2 rounded-xl border border-border bg-surface/40 p-4",
        className,
      )}
    >
      <Skeleton className="mb-3 h-4 w-1/3" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}
