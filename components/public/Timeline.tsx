import type { ReactNode } from "react";

import { Reveal } from "@/components/public/motion/Reveal";
import { cn } from "@/components/public/theme/utils";

export type TimelineStep = {
  title: ReactNode;
  description?: ReactNode;
};

type TimelineProps = {
  steps: TimelineStep[];
  className?: string;
  numbered?: boolean;
};

/** Compact engineering workflow — 3×2 desktop, single column mobile. */
export function Timeline({
  steps,
  className,
  numbered = true,
}: TimelineProps) {
  if (steps.length === 0) return null;

  return (
    <ol
      className={cn(
        "relative grid gap-6 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-8 lg:grid-cols-3",
        className,
      )}
    >
      {steps.map((step, index) => (
        <Reveal key={index}>
          <li className="relative border-t border-gold/35 pt-4">
            {numbered ? (
              <span className="font-mono text-sm tracking-[0.18em] text-gold">
                {String(index + 1).padStart(2, "0")}
              </span>
            ) : null}
            <p className="mt-2 text-base font-semibold leading-snug text-foreground">
              {step.title}
            </p>
            {step.description ? (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            ) : null}
          </li>
        </Reveal>
      ))}
    </ol>
  );
}
