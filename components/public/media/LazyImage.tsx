import Image, { type ImageProps } from "next/image";

import { cn } from "@/components/public/theme/utils";

type LazyImageProps = Omit<ImageProps, "alt" | "loading"> & {
  alt: string;
  className?: string;
  priority?: boolean;
};

export function LazyImage({
  alt,
  className,
  priority = false,
  fetchPriority,
  quality,
  ...props
}: LazyImageProps) {
  return (
    <Image
      alt={alt}
      className={cn(className)}
      loading={priority ? undefined : "lazy"}
      priority={priority}
      fetchPriority={fetchPriority ?? (priority ? "high" : "auto")}
      quality={quality ?? 75}
      decoding="async"
      {...props}
    />
  );
}
