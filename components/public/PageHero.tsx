import type { ReactNode } from "react";

import { Breadcrumb, type BreadcrumbItem } from "@/components/public/Breadcrumb";
import { HeroBackground } from "@/components/public/HeroBackground";
import { Container } from "@/components/public/layout/Container";
import { FadeUp } from "@/components/public/motion/FadeUp";
import { Heading } from "@/components/public/typography/Heading";
import { Lead } from "@/components/public/typography/Lead";
import { Subheading } from "@/components/public/typography/Subheading";
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
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative min-h-[42dvh] w-full overflow-hidden pt-16",
        className,
      )}
    >
      <HeroBackground imageUrl={imageUrl} alt={imageAlt} overlay />

      <Container className="relative flex min-h-[42dvh] flex-col justify-end pb-14 pt-20">
        <FadeUp>
          {breadcrumb ? (
            <Breadcrumb
              items={breadcrumb}
              rtl={rtlBreadcrumb}
              ariaLabel={breadcrumbLabel}
              className="mb-5"
            />
          ) : null}
          {eyebrow ? <Subheading className="mb-3">{eyebrow}</Subheading> : null}
          <Heading as="h1" size="h1" className="max-w-3xl">
            {title}
          </Heading>
          {description ? (
            <Lead className="mt-4 max-w-2xl">{description}</Lead>
          ) : null}
          {children}
        </FadeUp>
      </Container>
    </section>
  );
}
