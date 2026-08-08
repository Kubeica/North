"use client";

import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLocale } from "next-intl";
import { useRef } from "react";

import { PublicButton } from "@/components/public/buttons/PublicButton";
import { HeroBackground } from "@/components/public/HeroBackground";
import { Container } from "@/components/public/layout/Container";
import { FadeUp } from "@/components/public/motion/FadeUp";
import { cn } from "@/components/public/theme/utils";
import { resolveHeroImageUrl } from "@/lib/media/public-assets";

type HeroProps = {
  brandName: string;
  title: string;
  /** Gold accent phrase — must be a resolved string, never a message key. */
  highlight: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  scrollHint: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  showScrollIndicator?: boolean;
  className?: string;
};

export function Hero({
  brandName,
  title,
  highlight,
  subtitle,
  primaryCta,
  secondaryCta,
  scrollHint,
  imageUrl,
  videoUrl,
  showScrollIndicator = true,
  className,
}: HeroProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const imageAlt = `${brandName} — ${title}`;
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  const resolvedImage = resolveHeroImageUrl(imageUrl);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative min-h-[100dvh] w-full overflow-hidden",
        className,
      )}
      aria-labelledby="home-hero-heading"
    >
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ y }}
      >
        <HeroBackground
          imageUrl={resolvedImage}
          videoUrl={videoUrl}
          alt={imageAlt}
          overlay
        />
      </motion.div>

      <Container className="relative flex min-h-[100dvh] flex-col justify-end pb-28 pt-36 sm:pb-32 lg:justify-center lg:pb-24 lg:pt-28">
        <div
          className={cn(
            "w-full max-w-xl lg:max-w-2xl",
            /* Keep content on the inline-start side so architecture stays visible on the opposite side */
            "ms-0 me-auto",
          )}
        >
          <FadeUp>
            <p className="mb-5 text-xs font-medium tracking-[0.28em] text-gold uppercase sm:text-sm">
              {brandName}
            </p>
          </FadeUp>

          <FadeUp delay={0.06}>
            <h1
              id="home-hero-heading"
              className={cn(
                "text-balance font-bold text-foreground",
                "text-[clamp(2.35rem,6.2vw,4.75rem)] leading-[1.08] tracking-tight",
                "max-w-[14ch] sm:max-w-[16ch]",
              )}
            >
              {title}
              {highlight ? (
                <>
                  {" "}
                  <span className="text-gold">{highlight}</span>
                </>
              ) : null}
            </h1>
          </FadeUp>

          <FadeUp delay={0.14}>
            <p className="mt-6 max-w-md text-pretty text-base leading-relaxed text-foreground/85 sm:text-lg">
              {subtitle}
            </p>
          </FadeUp>

          <FadeUp delay={0.22} className="mt-10 flex flex-wrap gap-3">
            <PublicButton href="/projects" size="lg" className="gap-2">
              {primaryCta}
              <Arrow className="size-4" aria-hidden />
            </PublicButton>
            <PublicButton
              href="/contact"
              variant="outline"
              size="lg"
              className="border-gold/55 bg-transparent text-foreground hover:border-gold hover:bg-[rgba(5,10,15,0.35)]"
            >
              {secondaryCta}
            </PublicButton>
          </FadeUp>
        </div>

        {showScrollIndicator ? (
          <a
            href="#values-strip"
            className="absolute inset-x-0 bottom-8 mx-auto flex w-fit flex-col items-center gap-1.5 text-muted-foreground transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <span className="text-[0.65rem] tracking-[0.22em] uppercase">
              {scrollHint}
            </span>
            <ChevronDown
              className="size-5 animate-pulse text-gold/85 motion-reduce:animate-none"
              aria-hidden
            />
          </a>
        ) : null}
      </Container>
    </section>
  );
}
