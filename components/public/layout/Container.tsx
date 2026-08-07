import type { ComponentPropsWithoutRef } from "react";

import type { ContainerSize } from "@/components/public/theme/tokens";
import { cn } from "@/components/public/theme/utils";

const sizeClass: Record<ContainerSize, string> = {
  sm: "max-w-[var(--nm-container-sm)]",
  md: "max-w-[var(--nm-container-md)]",
  lg: "max-w-[var(--nm-container-lg)]",
  xl: "max-w-[var(--nm-container-xl)]",
  full: "max-w-none",
};

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  size?: ContainerSize;
};

export function Container({
  size = "xl",
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "nm-container mx-auto w-full",
        sizeClass[size],
        className,
      )}
      {...props}
    />
  );
}
