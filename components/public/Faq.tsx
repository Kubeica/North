import type { ReactNode } from "react";

import { cn } from "@/components/public/theme/utils";

export type FaqItem = {
  question: ReactNode;
  answer: ReactNode;
};

type FaqProps = {
  items: FaqItem[];
  className?: string;
};

/**
 * Accessible FAQ accordion using native details/summary (no client JS).
 * Respects prefers-reduced-motion via global CSS.
 */
export function Faq({ items, className }: FaqProps) {
  if (items.length === 0) return null;

  return (
    <div
      className={cn("divide-y divide-border/70 border-y border-border/70", className)}
      role="list"
    >
      {items.map((item, index) => (
        <details
          key={index}
          className="group py-5 open:bg-surface/20"
          role="listitem"
        >
          <summary
            className={cn(
              "flex cursor-pointer list-none items-center justify-between gap-4",
              "text-start text-base font-medium text-foreground",
              "marker:content-none [&::-webkit-details-marker]:hidden",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
            )}
          >
            <span>{item.question}</span>
            <span
              aria-hidden
              className="shrink-0 text-gold transition-transform duration-300 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="mt-3 max-w-3xl pe-8 text-sm leading-relaxed text-muted-foreground">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
