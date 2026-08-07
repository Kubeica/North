import { MapPin } from "lucide-react";

import { Caption } from "@/components/public/typography/Caption";
import { cn } from "@/components/public/theme/utils";

type MapPlaceholderProps = {
  latitude?: number | null;
  longitude?: number | null;
  label: string;
  unavailableLabel: string;
  className?: string;
};

/** Non-interactive map preview. Uses OSM embed when coordinates exist. */
export function MapPlaceholder({
  latitude,
  longitude,
  label,
  unavailableLabel,
  className,
}: MapPlaceholderProps) {
  const hasCoords =
    latitude != null &&
    longitude != null &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  if (!hasCoords) {
    return (
      <div
        className={cn(
          "flex min-h-[240px] flex-col items-center justify-center gap-3 border border-border/60 bg-surface-2/40 p-8 text-center",
          className,
        )}
        role="img"
        aria-label={label}
      >
        <MapPin className="size-6 text-gold" aria-hidden />
        <Caption>{unavailableLabel}</Caption>
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
        "relative min-h-[240px] overflow-hidden border border-border/60 bg-surface",
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
