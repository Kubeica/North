import { LazyImage } from "./LazyImage";
import { cn } from "@/components/public/theme/utils";

type GalleryImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function GalleryImage({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
}: GalleryImageProps) {
  return (
    <div className={cn("relative aspect-[4/3] overflow-hidden bg-surface-2", className)}>
      <LazyImage
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}
