import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "@/components/public/theme/utils";
import { Link } from "@/i18n/navigation";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
  /** When true, use ChevronLeft as separator (for RTL layouts). */
  rtl?: boolean;
  ariaLabel?: string;
};

export function Breadcrumb({
  items,
  className,
  rtl = false,
  ariaLabel = "Breadcrumb",
}: BreadcrumbProps) {
  if (items.length === 0) return null;

  const Separator = rtl ? ChevronLeft : ChevronRight;

  return (
    <nav aria-label={ariaLabel} className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? (
                <Separator className="size-3.5 shrink-0 opacity-60" aria-hidden />
              ) : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href as ComponentProps<typeof Link>["href"]}
                  className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(isLast && "text-foreground")}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
