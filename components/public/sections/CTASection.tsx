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
};

export function CTASection({
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
  align = "center",
  children,
}: CTASectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-y border-border",
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--gold)_12%,transparent),_transparent_55%)]"
      />
      <Container
        className={cn(
          "relative nm-section",
          align === "center" && "text-center",
        )}
      >
        <Reveal>
          <Heading as="h2" size="h2">
            {title}
          </Heading>
          {description ? (
            <Lead
              className={cn(
                "mt-4 max-w-xl",
                align === "center" && "mx-auto",
              )}
            >
              {description}
            </Lead>
          ) : null}
          {(primaryAction || secondaryAction) && (
            <div
              className={cn(
                "mt-8 flex flex-wrap gap-3",
                align === "center" && "items-center justify-center",
              )}
            >
              {primaryAction ? (
                <PublicButton href={primaryAction.href}>
                  {primaryAction.label}
                </PublicButton>
              ) : null}
              {secondaryAction ? (
                <PublicButton href={secondaryAction.href} variant="outline">
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
