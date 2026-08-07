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

export function Timeline({
  steps,
  className,
  numbered = true,
}: TimelineProps) {
  if (steps.length === 0) return null;

  return (
    <ol className={cn("grid gap-8 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {steps.map((step, index) => (
        <Reveal key={index} delay={index * 0.07}>
          <li className="relative">
            {numbered ? (
              <span className="font-mono text-sm text-gold/80">
                {String(index + 1).padStart(2, "0")}
              </span>
            ) : null}
            <p className="mt-3 text-base font-medium leading-snug text-foreground">
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
