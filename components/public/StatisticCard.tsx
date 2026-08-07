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
        align === "center" ? "text-center" : "text-center md:text-start",
        className,
      )}
    >
      <p className="text-3xl font-semibold tracking-tight text-gold sm:text-4xl">
        {value}
      </p>
      <Caption className="mt-2">{label}</Caption>
    </div>
  );
}
