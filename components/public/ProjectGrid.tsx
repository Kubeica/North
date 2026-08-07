import type { ReactNode } from "react";

import { cn } from "@/components/public/theme/utils";

type ProjectGridProps = {
  children: ReactNode;
  className?: string;
};

export function ProjectGrid({ children, className }: ProjectGridProps) {
  return (
    <div className={cn("nm-grid-projects", className)}>{children}</div>
  );
}
