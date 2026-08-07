import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/components/public/theme/utils";

type CaptionProps = ComponentPropsWithoutRef<"p">;

export function Caption({ className, ...props }: CaptionProps) {
  return (
    <p
      className={cn(
        "text-[length:var(--nm-text-caption)] leading-[1.5] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
