import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/components/public/theme/utils";

type ParagraphProps = ComponentPropsWithoutRef<"p">;

export function Paragraph({ className, ...props }: ParagraphProps) {
  return (
    <p
      className={cn(
        "text-[length:var(--nm-text-body)] leading-[1.7] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
