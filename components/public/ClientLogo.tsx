import Image from "next/image";

import { cn } from "@/components/public/theme/utils";
import {
  LOCAL_HERO_IMAGE,
  resolvePublicImageUrl,
} from "@/lib/media/public-assets";

type ClientLogoProps = {
  name: string;
  logoUrl?: string | null;
  className?: string;
  width?: number;
  height?: number;
};

export function ClientLogo({
  name,
  logoUrl,
  className,
  width = 140,
  height = 48,
}: ClientLogoProps) {
  const resolved = logoUrl?.trim()
    ? resolvePublicImageUrl(logoUrl, "")
    : "";

  // Demo placeholders resolve to the architectural hero — use a text mark instead.
  const useImage =
    Boolean(resolved) &&
    resolved !== LOCAL_HERO_IMAGE &&
    resolved !== "";

  return (
    <div
      className={cn(
        "flex min-h-10 w-full max-w-[9.5rem] items-center justify-center opacity-60 transition-opacity duration-300 hover:opacity-100",
        useImage && "grayscale hover:grayscale-0",
        className,
      )}
    >
      {useImage ? (
        <Image
          src={resolved}
          alt={name}
          width={width}
          height={height}
          sizes="140px"
          loading="lazy"
          decoding="async"
          quality={75}
          className="max-h-12 w-auto object-contain"
        />
      ) : (
        <span className="max-w-[10rem] text-center text-[0.8rem] font-medium tracking-[0.04em] text-muted-foreground uppercase transition-colors group-hover:text-gold hover:text-gold">
          {name}
        </span>
      )}
    </div>
  );
}
