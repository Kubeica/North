import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Heading } from "@/components/public/typography/Heading";
import { Paragraph } from "@/components/public/typography/Paragraph";
import { cn } from "@/components/public/theme/utils";

type FeatureCardProps = {
  title: ReactNode;
  description?: ReactNode;
  icon?: LucideIcon;
  className?: string;
  children?: ReactNode;
};

export function FeatureCard({
  title,
  description,
  icon: Icon,
  className,
  children,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "border-s-2 border-gold/60 ps-5",
        className,
      )}
    >
      {Icon ? (
        <Icon className="mb-3 size-5 text-gold" aria-hidden />
      ) : null}
      <Heading as="h3" size="h4" className="text-gold">
        {title}
      </Heading>
      {description ? (
        <Paragraph className="mt-3 text-sm">{description}</Paragraph>
      ) : null}
      {children}
    </div>
  );
}
