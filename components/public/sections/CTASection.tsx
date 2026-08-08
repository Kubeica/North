import Image from "next/image";
import type { ComponentProps, ReactNode } from "react";

import { PublicButton } from "@/components/public/buttons/PublicButton";
import { Container } from "@/components/public/layout/Container";
import { Reveal } from "@/components/public/motion/Reveal";
import { Heading } from "@/components/public/typography/Heading";
import { Lead } from "@/components/public/typography/Lead";
import { cn } from "@/components/public/theme/utils";

export type CTAAction = {
  label: ReactNode;
  href: NonNullable<ComponentProps<typeof PublicButton>["href"]>;
};

type CTASectionProps = {
  title: ReactNode;
  description?: ReactNode;
  primaryAction?: CTAAction;
  secondaryAction?: CTAAction;
  className?: string;
  align?: "start" | "center";
  children?: ReactNode;
  imageUrl?: string | null;
};

export function CTASection({
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
  align = "start",
  children,
  imageUrl,
}: CTASectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-y border-border",
        className,
      )}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt=""
          fill
          sizes="100vw"
          loading="lazy"
          decoding="async"
          quality={75}
          className="object-cover opacity-30"
          aria-hidden
        />
      ) : null}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-navy/80"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,color-mix(in_srgb,var(--gold)_10%,transparent),transparent_50%)]"
      />
      <Container
        className={cn(
          "relative nm-section",
          align === "center" && "text-center",
        )}
      >
        <Reveal>
          <Heading as="h2" size="h1" className="max-w-3xl text-balance">
            {title}
          </Heading>
          {description ? (
            <Lead
              className={cn(
                "mt-5 max-w-xl text-foreground/80",
                align === "center" && "mx-auto",
              )}
            >
              {description}
            </Lead>
          ) : null}
          {(primaryAction || secondaryAction) && (
            <div
              className={cn(
                "mt-10 flex flex-wrap gap-3",
                align === "center" && "items-center justify-center",
              )}
            >
              {primaryAction ? (
                <PublicButton href={primaryAction.href} size="lg">
                  {primaryAction.label}
                </PublicButton>
              ) : null}
              {secondaryAction ? (
                <PublicButton
                  href={secondaryAction.href}
                  variant="outline"
                  size="lg"
                  className="border-gold/45 hover:border-gold"
                >
                  {secondaryAction.label}
                </PublicButton>
              ) : null}
            </div>
          )}
          {children}
        </Reveal>
      </Container>
    </section>
  );
}
