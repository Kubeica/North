import type { ReactNode } from "react";

import { HeroImage } from "@/components/public/media/HeroImage";
import { resolveHeroImageUrl } from "@/lib/media/public-assets";
import { cn } from "@/components/public/theme/utils";

type HeroBackgroundProps = {
  imageUrl?: string | null;
  videoUrl?: string | null;
  alt?: string;
  className?: string;
  overlay?: boolean;
  children?: ReactNode;
};

/**
 * Cinematic architectural media plane.
 * Overlays stay in ~0.28–0.52 opacity so the building remains visible.
 */
export function HeroBackground({
  imageUrl,
  videoUrl,
  alt = "",
  className,
  overlay = true,
  children,
}: HeroBackgroundProps) {
  const src = resolveHeroImageUrl(imageUrl);

  return (
    <div className={cn("absolute inset-0 bg-navy", className)}>
      {videoUrl ? (
        <video
          className="h-full w-full object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          poster={src}
          aria-hidden={alt ? undefined : true}
          aria-label={alt || undefined}
        >
          <source src={videoUrl} />
        </video>
      ) : (
        <HeroImage src={src} alt={alt} />
      )}

      {overlay ? (
        <>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(5, 10, 15, 0.28)" }}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(5, 10, 15, 0.52) 0%, rgba(5, 10, 15, 0.18) 38%, rgba(5, 10, 15, 0.05) 70%, transparent 100%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-[rgba(5,10,15,0.32)] via-[rgba(5,10,15,0.08)] to-transparent rtl:bg-gradient-to-l"
          />
        </>
      ) : null}

      {children}
    </div>
  );
}
