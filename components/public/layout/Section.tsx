import type { ComponentPropsWithoutRef } from "react";

import type { SectionTone } from "@/components/public/theme/tokens";
import { cn, sectionToneClass } from "@/components/public/theme/utils";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  tone?: SectionTone;
  /** Alternate between dark and surface for stacked sections. */
  alternate?: boolean;
  alternateIndex?: number;
  padded?: boolean;
  container?: boolean;
};

export function Section({
  tone,
  alternate = false,
  alternateIndex = 0,
  padded = true,
  container = false,
  className,
  children,
  id,
  ...props
}: SectionProps) {
  const resolvedTone: SectionTone =
    tone ??
    (alternate
      ? alternateIndex % 2 === 0
        ? "dark"
        : "surface"
      : "dark");

  return (
    <section
      id={id}
      className={cn(
        sectionToneClass(resolvedTone),
        padded && "nm-section",
        className,
      )}
      {...props}
    >
      {container ? (
        <div className="nm-container">{children}</div>
      ) : (
        children
      )}
    </section>
  );
}
