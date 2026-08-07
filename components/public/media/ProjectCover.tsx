import { LazyImage } from "./LazyImage";
import { cn } from "@/components/public/theme/utils";

type ProjectCoverProps = {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fallbackLabel?: string;
};

export function ProjectCover({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
  fallbackLabel,
}: ProjectCoverProps) {
  return (
    <div
      className={cn(
        "relative aspect-[4/3] overflow-hidden bg-surface-2",
        className,
      )}
    >
      {src ? (
        <LazyImage
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-navy to-surface text-muted-foreground">
          {fallbackLabel ?? alt}
        </div>
      )}
    </div>
  );
}
