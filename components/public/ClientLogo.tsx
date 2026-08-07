import Image from "next/image";

import { cn } from "@/components/public/theme/utils";

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
  return (
    <div
      className={cn(
        "flex h-16 w-36 shrink-0 items-center justify-center opacity-70 grayscale transition-[opacity,filter] hover:opacity-100 hover:grayscale-0",
        className,
      )}
    >
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={name}
          width={width}
          height={height}
          sizes="140px"
          loading="lazy"
          decoding="async"
          quality={70}
          className="max-h-12 w-auto object-contain"
        />
      ) : (
        <span className="text-center text-sm font-medium text-muted-foreground">
          {name}
        </span>
      )}
    </div>
  );
}
