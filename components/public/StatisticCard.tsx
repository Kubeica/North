import type { ReactNode } from "react";

import { Caption } from "@/components/public/typography/Caption";
import { cn } from "@/components/public/theme/utils";

type StatisticCardProps = {
  value: ReactNode;
  label: ReactNode;
  className?: string;
  align?: "start" | "center";
};

export function StatisticCard({
  value,
  label,
  className,
  align = "start",
}: StatisticCardProps) {
  return (
    <div
      className={cn(
        "border-s border-gold/50 ps-4",
        align === "center" ? "text-center" : "text-start",
        className,
      )}
    >
      <p className="font-semibold tracking-tight text-foreground text-[clamp(2.25rem,4vw,3.25rem)] leading-none">
        {value}
      </p>
      <Caption className="mt-3 max-w-[14ch] text-muted-foreground">
        {label}
      </Caption>
    </div>
  );
}
