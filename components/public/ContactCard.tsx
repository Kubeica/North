import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { ReactNode } from "react";

import { Heading } from "@/components/public/typography/Heading";
import { Paragraph } from "@/components/public/typography/Paragraph";
import { cn } from "@/components/public/theme/utils";

type ContactCardProps = {
  title?: ReactNode;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  hours?: string | null;
  className?: string;
  children?: ReactNode;
};

export function ContactCard({
  title,
  address,
  phone,
  email,
  hours,
  className,
  children,
}: ContactCardProps) {
  return (
    <div
      className={cn(
        "border border-border/45 bg-surface/35 p-5 md:p-6",
        className,
      )}
    >
      {title ? (
        <Heading
          as="h3"
          size="h4"
          className="mb-4 text-xs tracking-[0.18em] text-gold uppercase"
        >
          {title}
        </Heading>
      ) : null}

      <ul className="space-y-3.5">
        {address ? (
          <li className="flex gap-3.5">
            <MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
            <Paragraph className="text-sm leading-relaxed">{address}</Paragraph>
          </li>
        ) : null}
        {phone ? (
          <li className="flex gap-3.5">
            <Phone className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="text-sm text-muted-foreground transition-colors hover:text-gold"
            >
              {phone}
            </a>
          </li>
        ) : null}
        {email ? (
          <li className="flex gap-3.5">
            <Mail className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
            <a
              href={`mailto:${email}`}
              className="text-sm break-all text-muted-foreground transition-colors hover:text-gold"
            >
              {email}
            </a>
          </li>
        ) : null}
        {hours ? (
          <li className="flex gap-3.5">
            <Clock className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
            <Paragraph className="text-sm leading-relaxed">{hours}</Paragraph>
          </li>
        ) : null}
      </ul>

      {children}
    </div>
  );
}
