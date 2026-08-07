"use client";

import { ChevronDown } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";

import { PublicButton } from "@/components/public/buttons/PublicButton";
import { HeroBackground } from "@/components/public/HeroBackground";
import { Container } from "@/components/public/layout/Container";
import { FadeUp } from "@/components/public/motion/FadeUp";
import { Caption } from "@/components/public/typography/Caption";
import { Heading } from "@/components/public/typography/Heading";
import { Lead } from "@/components/public/typography/Lead";
import { cn } from "@/components/public/theme/utils";

type HeroProps = {
  brandName?: string;
  title?: string;
  subtitle?: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  showScrollIndicator?: boolean;
  className?: string;
};

export function Hero({
  brandName,
  title,
  subtitle,
  imageUrl,
  videoUrl,
  showScrollIndicator = true,
  className,
}: HeroProps) {
  const t = useTranslations("home");
  const tBrand = useTranslations("brand");
  const tCta = useTranslations("cta");
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [0, 120],
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.85],
    reduceMotion ? [1, 1] : [1, 0.35],
  );

  const brand = brandName ?? tBrand("short");
  const headline = title ?? t("heroTitle");
  const lead = subtitle ?? t("heroSubtitle");

  const imageAlt = `${brand} — ${headline}`;

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative min-h-[92dvh] w-full overflow-hidden md:min-h-[100dvh]",
        className,
      )}
      aria-labelledby="home-hero-heading"
    >
      <motion.div className="absolute inset-0 will-change-transform" style={{ y, opacity }}>
        <HeroBackground
          imageUrl={imageUrl}
          videoUrl={videoUrl}
          alt={imageAlt}
          overlay
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
        />
      </motion.div>

      <Container className="relative flex min-h-[92dvh] flex-col justify-end pb-20 pt-28 sm:pb-24 md:min-h-[100dvh] lg:pb-32">
        <div className="max-w-4xl">
          <FadeUp>
            <Caption className="mb-4 tracking-[0.22em] text-gold uppercase">
              {brand}
            </Caption>
          </FadeUp>
          <FadeUp delay={0.08}>
            <Heading
              as="h1"
              id="home-hero-heading"
              size="display"
              className="max-w-4xl text-balance text-foreground"
            >
              {headline}
            </Heading>
          </FadeUp>
          <FadeUp delay={0.18}>
            <Lead className="mt-6 max-w-xl text-muted-foreground">{lead}</Lead>
          </FadeUp>
          <FadeUp delay={0.3} className="mt-10 flex flex-wrap gap-3">
            <PublicButton href="/projects" size="lg">
              {tCta("viewProjects")}
            </PublicButton>
            <PublicButton href="/contact" variant="outline" size="lg">
              {tCta("contactUs")}
            </PublicButton>
          </FadeUp>
        </div>

        {showScrollIndicator ? (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-1"
            aria-hidden
          >
            <Caption className="tracking-[0.18em] uppercase">
              {t("scrollHint")}
            </Caption>
            {!reduceMotion ? (
              <ChevronDown
                className="size-5 animate-bounce text-gold/80"
                aria-hidden
              />
            ) : (
              <ChevronDown className="size-5 text-gold/80" aria-hidden />
            )}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
