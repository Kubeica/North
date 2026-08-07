import type { ReactNode } from "react";

import { Heading } from "@/components/public/typography/Heading";
import { Lead } from "@/components/public/typography/Lead";
import { Subheading } from "@/components/public/typography/Subheading";
import { cn } from "@/components/public/theme/utils";

type SectionTitleProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "start" | "center";
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4";
  size?: "display" | "h1" | "h2" | "h3" | "h4";
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "start",
  className,
  as = "h2",
  size = "h2",
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? <Subheading className="mb-3">{eyebrow}</Subheading> : null}
      <Heading as={as} size={size}>
        {title}
      </Heading>
      {description ? (
        <Lead className={cn("mt-3", align === "center" && "mx-auto")}>
          {description}
        </Lead>
      ) : null}
    </div>
  );
}
