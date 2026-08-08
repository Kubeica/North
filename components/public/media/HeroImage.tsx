import { LazyImage } from "./LazyImage";
import { cn } from "@/components/public/theme/utils";

type HeroImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

/** LCP-optimized full-bleed hero image (priority + high fetchPriority). */
export function HeroImage({
  src,
  alt,
  className,
  priority = true,
}: HeroImageProps) {
  return (
    <LazyImage
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes="100vw"
      quality={75}
      className={cn("object-cover object-center", className)}
    />
  );
}
