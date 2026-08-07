import { GalleryImage } from "@/components/public/media/GalleryImage";
import { Reveal } from "@/components/public/motion/Reveal";
import { cn } from "@/components/public/theme/utils";

export type GalleryItem = {
  src: string;
  alt: string;
};

type GalleryProps = {
  items: GalleryItem[];
  className?: string;
  columns?: 2 | 3 | 4;
};

const columnClass = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

export function Gallery({ items, className, columns = 3 }: GalleryProps) {
  if (items.length === 0) return null;

  return (
    <div className={cn("grid gap-4", columnClass[columns], className)}>
      {items.map((item, index) => (
        <Reveal key={`${item.src}-${index}`} delay={index * 0.05}>
          <GalleryImage src={item.src} alt={item.alt} />
        </Reveal>
      ))}
    </div>
  );
}
