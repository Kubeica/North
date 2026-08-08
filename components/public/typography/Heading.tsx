import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cn } from "@/components/public/theme/utils";

const sizeClass = {
  display:
    "text-[length:var(--nm-text-display)] font-bold leading-[1.08] tracking-tight",
  h1: "text-[length:var(--nm-text-h1)] font-bold leading-[1.12] tracking-tight",
  h2: "text-[length:var(--nm-text-h2)] font-semibold leading-[1.18] tracking-tight",
  h3: "text-[length:var(--nm-text-h3)] font-semibold leading-[1.3] tracking-tight",
  h4: "text-[length:var(--nm-text-h4)] font-semibold leading-[1.35] tracking-tight",
} as const;

type HeadingLevel = "h1" | "h2" | "h3" | "h4";
type HeadingSize = keyof typeof sizeClass;

type HeadingProps = {
  as?: HeadingLevel;
  size?: HeadingSize;
  className?: string;
  children: React.ReactNode;
} & Omit<ComponentPropsWithoutRef<"h1">, "as" | "children" | "className">;

export function Heading({
  as,
  size,
  className,
  children,
  ...props
}: HeadingProps) {
  const Tag = (as ?? "h2") as ElementType;
  const resolvedSize = size ?? (as ?? "h2");

  return (
    <Tag
      className={cn(
        "text-balance text-foreground",
        sizeClass[resolvedSize],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
