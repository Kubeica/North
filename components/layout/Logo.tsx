"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";

import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  shortName?: string;
  logoUrl?: string | null;
};

export function Logo({ className, shortName, logoUrl }: LogoProps) {
  const locale = useLocale();
  const label = shortName?.trim() || "Northern Meteor";
  const src = logoUrl?.trim() || "";
  // Local public assets: serve the file directly so Next image cache cannot keep an old logo.
  const isLocal = src.startsWith("/");

  return (
    <Link
      href={`/${locale}`}
      className={cn(
        "group inline-flex items-center gap-2.5 font-semibold tracking-tight text-foreground transition-colors hover:text-gold",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={label}
          width={44}
          height={44}
          className="size-9 shrink-0 object-contain sm:size-10"
          priority
          unoptimized={isLocal}
        />
      ) : (
        <span
          aria-hidden
          className="relative flex size-8 shrink-0 items-center justify-center border border-gold/70 text-[0.65rem] font-bold tracking-[0.08em] text-gold transition-colors group-hover:border-gold group-hover:bg-gold/10 sm:size-9 sm:text-[0.7rem]"
        >
          NM
        </span>
      )}
      <span className="leading-none">{label}</span>
    </Link>
  );
}
