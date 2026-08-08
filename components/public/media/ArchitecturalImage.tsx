import { LazyImage } from "@/components/public/media/LazyImage";
import { cn } from "@/components/public/theme/utils";
import {
  localArchitectureImage,
  resolvePublicImageUrl,
} from "@/lib/media/public-assets";

type ArchitecturalImageProps = {
  src?: string | null;
  alt: string;
  seed?: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Soft bottom readability gradient. */
  overlay?: boolean;
};

/**
 * Always-filled architectural media frame.
 * Never renders an empty black rectangle when CMS media is missing.
 */
export function ArchitecturalImage({
  src,
  alt,
  seed = "frame",
  className,
  imageClassName,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  overlay = false,
}: ArchitecturalImageProps) {
  const resolved = resolvePublicImageUrl(src, localArchitectureImage(seed));

  return (
    <div className={cn("relative overflow-hidden bg-surface-2", className)}>
      <LazyImage
        src={resolved}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          "object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]",
          imageClassName,
        )}
      />
      {overlay ? (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(5, 10, 15, 0.55) 0%, rgba(5, 10, 15, 0.12) 45%, transparent 100%)",
          }}
        />
      ) : null}
    </div>
  );
}
