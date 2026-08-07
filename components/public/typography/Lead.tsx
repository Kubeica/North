import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/components/public/theme/utils";

type LeadProps = ComponentPropsWithoutRef<"p">;

export function Lead({ className, ...props }: LeadProps) {
  return (
    <p
      className={cn(
        "text-[length:var(--nm-text-lead)] leading-[1.65] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
