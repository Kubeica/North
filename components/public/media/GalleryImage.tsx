import { ArchitecturalImage } from "@/components/public/media/ArchitecturalImage";
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
    <ArchitecturalImage
      src={src}
      alt={alt}
      seed={alt}
      sizes={sizes}
      priority={priority}
      className={cn("aspect-[4/3]", className)}
    />
  );
}
