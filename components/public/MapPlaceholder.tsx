import { MapPin } from "lucide-react";

import { Caption } from "@/components/public/typography/Caption";
import { cn } from "@/components/public/theme/utils";

type MapPlaceholderProps = {
  latitude?: number | null;
  longitude?: number | null;
  label: string;
  unavailableLabel: string;
  className?: string;
  /** When false, hide the block entirely if coordinates are missing. */
  showUnavailable?: boolean;
};

/** Non-interactive map preview. Collapses when coordinates are absent. */
export function MapPlaceholder({
  latitude,
  longitude,
  label,
  unavailableLabel,
  className,
  showUnavailable = false,
}: MapPlaceholderProps) {
  const hasCoords =
    latitude != null &&
    longitude != null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  if (!hasCoords) {
    if (!showUnavailable) return null;

    return (
      <div
        className={cn(
          "flex items-center gap-3 border border-border/50 bg-surface-2/30 px-4 py-4",
          className,
        )}
        role="status"
        aria-label={label}
      >
        <MapPin className="size-4 shrink-0 text-gold" aria-hidden />
        <Caption className="text-muted-foreground">{unavailableLabel}</Caption>
      </div>
    );
  }

  const delta = 0.02;
  const bbox = [
    longitude - delta,
    latitude - delta,
    longitude + delta,
    latitude + delta,
  ].join("%2C");
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude}%2C${longitude}`;

  return (
    <div
      className={cn(
        "relative h-[220px] overflow-hidden border border-border/50 bg-surface md:h-[260px]",
        className,
      )}
    >
      <iframe
        title={label}
        src={src}
        className="absolute inset-0 h-full w-full grayscale-[30%] contrast-125"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 to-transparent"
      />
    </div>
  );
}
