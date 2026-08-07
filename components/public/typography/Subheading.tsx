import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/components/public/theme/utils";

type SubheadingProps = ComponentPropsWithoutRef<"p">;

/** Eyebrow / section kicker above a title. */
export function Subheading({ className, ...props }: SubheadingProps) {
  return (
    <p
      className={cn(
        "text-xs font-medium uppercase tracking-[0.18em] text-gold",
        className,
      )}
      {...props}
    />
  );
}
