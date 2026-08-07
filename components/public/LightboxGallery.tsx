"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { GalleryImage } from "@/components/public/media/GalleryImage";
import { Reveal } from "@/components/public/motion/Reveal";
import { cn } from "@/components/public/theme/utils";

export type LightboxGalleryItem = {
  src: string;
  alt: string;
};

type LightboxGalleryProps = {
  items: LightboxGalleryItem[];
  className?: string;
  columns?: 2 | 3 | 4;
  openLabel?: string;
  closeLabel?: string;
  dialogLabel?: string;
};

const columnClass = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

/**
 * Responsive gallery with accessible lightbox (native dialog).
 * Keyboard: Enter/Space to open, Escape to close, focus returns to trigger.
 */
export function LightboxGallery({
  items,
  className,
  columns = 3,
  openLabel = "View image",
  closeLabel = "Close",
  dialogLabel = "Image lightbox",
}: LightboxGalleryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => {
    dialogRef.current?.close();
    setActiveIndex(null);
    triggerRef.current?.focus();
  }, []);

  const open = useCallback((index: number, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setActiveIndex(index);
    dialogRef.current?.showModal();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function onClose() {
      setActiveIndex(null);
      triggerRef.current?.focus();
    }

    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  if (items.length === 0) return null;

  const active = activeIndex != null ? items[activeIndex] : null;

  return (
    <>
      <div className={cn("grid gap-4", columnClass[columns], className)}>
        {items.map((item, index) => (
          <Reveal key={`${item.src}-${index}`} delay={index * 0.05}>
            <button
              type="button"
              className="group relative block w-full overflow-hidden text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              onClick={(event) => open(index, event.currentTarget)}
              aria-label={`${openLabel}: ${item.alt}`}
            >
              <GalleryImage src={item.src} alt={item.alt} />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-background/0 transition-colors group-hover:bg-background/20"
              />
            </button>
          </Reveal>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="fixed inset-0 z-50 m-0 h-full max-h-none w-full max-w-none border-0 bg-background/95 p-0 text-foreground backdrop:bg-background/80 open:flex open:items-center open:justify-center"
        aria-labelledby={titleId}
        aria-label={dialogLabel}
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
      >
        <div className="relative flex h-full w-full max-w-6xl flex-col items-center justify-center px-4 py-16 sm:px-8">
          <h2 id={titleId} className="sr-only">
            {active?.alt ?? dialogLabel}
          </h2>
          <button
            type="button"
            onClick={close}
            className="absolute end-4 top-4 inline-flex size-11 items-center justify-center rounded-md border border-border bg-surface text-foreground transition-colors hover:border-gold/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label={closeLabel}
          >
            <X className="size-5" aria-hidden />
          </button>
          {active ? (
            <div className="relative aspect-[16/10] w-full max-h-[80vh]">
              <Image
                src={active.src}
                alt={active.alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
          ) : null}
        </div>
      </dialog>
    </>
  );
}
