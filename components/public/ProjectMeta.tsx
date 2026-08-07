import type { ReactNode } from "react";

import { cn } from "@/components/public/theme/utils";

export type ProjectMetaItem = {
  label: string;
  value: ReactNode;
};

type ProjectMetaProps = {
  items: ProjectMetaItem[];
  className?: string;
  density?: "compact" | "comfortable";
};

/** Labeled project metadata row (client, location, status, dates). */
export function ProjectMeta({
  items,
  className,
  density = "compact",
}: ProjectMetaProps) {
  const visible = items.filter(
    (item) => item.value !== null && item.value !== undefined && item.value !== "",
  );
  if (visible.length === 0) return null;

  return (
    <dl
      className={cn(
        "grid gap-3",
        density === "comfortable" ? "sm:grid-cols-2" : "grid-cols-2",
        className,
      )}
    >
      {visible.map((item) => (
        <div key={item.label} className="min-w-0">
          <dt className="text-xs tracking-wide text-muted-foreground uppercase">
            {item.label}
          </dt>
          <dd className="mt-1 text-sm text-foreground text-pretty">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
