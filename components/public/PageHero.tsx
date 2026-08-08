import type { ReactNode } from "react";

import { Breadcrumb, type BreadcrumbItem } from "@/components/public/Breadcrumb";
import { HeroBackground } from "@/components/public/HeroBackground";
import { Container } from "@/components/public/layout/Container";
import { FadeUp } from "@/components/public/motion/FadeUp";
import { Caption } from "@/components/public/typography/Caption";
import { Heading } from "@/components/public/typography/Heading";
import { Lead } from "@/components/public/typography/Lead";
import { cn } from "@/components/public/theme/utils";

type PageHeroProps = {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  imageUrl?: string | null;
  imageAlt?: string;
  breadcrumb?: BreadcrumbItem[];
  breadcrumbLabel?: string;
  rtlBreadcrumb?: boolean;
  className?: string;
  children?: ReactNode;
  /** Compact for inner pages vs taller portfolio heroes. */
  size?: "default" | "tall";
};

export function PageHero({
  title,
  description,
  eyebrow,
  imageUrl,
  imageAlt = "",
  breadcrumb,
  breadcrumbLabel,
  rtlBreadcrumb,
  className,
  children,
  size = "default",
}: PageHeroProps) {
  const minH =
    size === "tall"
      ? "min-h-[32dvh] sm:min-h-[38dvh]"
      : "min-h-[28dvh] sm:min-h-[32dvh]";

  return (
    <section
      className={cn("relative w-full overflow-hidden pt-16", minH, className)}
    >
      <HeroBackground imageUrl={imageUrl} alt={imageAlt} overlay />

      <Container
        className={cn(
          "relative flex flex-col justify-end pb-10 pt-20 sm:pb-12 sm:pt-24",
          minH,
        )}
      >
        <FadeUp>
          {breadcrumb ? (
            <Breadcrumb
              items={breadcrumb}
              rtl={rtlBreadcrumb}
              ariaLabel={breadcrumbLabel}
              className="mb-5"
            />
          ) : null}
          {eyebrow ? (
            <Caption className="mb-3 tracking-[0.22em] text-gold uppercase">
              {eyebrow}
            </Caption>
          ) : null}
          <Heading as="h1" size="h1" className="max-w-3xl text-balance">
            {title}
          </Heading>
          {description ? (
            <Lead className="mt-4 max-w-2xl text-foreground/80">
              {description}
            </Lead>
          ) : null}
          {children}
        </FadeUp>
      </Container>
    </section>
  );
}
