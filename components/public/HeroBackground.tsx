import type { ReactNode } from "react";

import { HeroImage } from "@/components/public/media/HeroImage";
import { cn } from "@/components/public/theme/utils";

type HeroBackgroundProps = {
  imageUrl?: string | null;
  videoUrl?: string | null;
  alt?: string;
  className?: string;
  overlay?: boolean;
  children?: ReactNode;
};

export function HeroBackground({
  imageUrl,
  videoUrl,
  alt = "",
  className,
  overlay = true,
  children,
}: HeroBackgroundProps) {
  return (
    <div className={cn("absolute inset-0", className)}>
      {videoUrl ? (
        <video
          className="h-full w-full object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          poster={imageUrl ?? undefined}
          aria-hidden={alt ? undefined : true}
          aria-label={alt || undefined}
        >
          <source src={videoUrl} />
        </video>
      ) : imageUrl ? (
        <HeroImage src={imageUrl} alt={alt} />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-navy via-background to-surface" />
      )}

      {overlay ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/20 to-transparent" />
        </>
      ) : null}

      {children}
    </div>
  );
}
