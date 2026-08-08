import { ArchitecturalImage } from "@/components/public/media/ArchitecturalImage";
import { cn } from "@/components/public/theme/utils";

type ProjectCoverProps = {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fallbackLabel?: string;
  seed?: string;
};

export function ProjectCover({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
  seed,
}: ProjectCoverProps) {
  return (
    <ArchitecturalImage
      src={src}
      alt={alt}
      seed={seed ?? alt}
      sizes={sizes}
      priority={priority}
      className={cn("aspect-[4/3]", className)}
    />
  );
}
