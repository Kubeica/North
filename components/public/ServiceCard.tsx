import { ArrowUpLeft, ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ComponentProps } from "react";

import { ArchitecturalImage } from "@/components/public/media/ArchitecturalImage";
import { Heading } from "@/components/public/typography/Heading";
import { Paragraph } from "@/components/public/typography/Paragraph";
import { cn } from "@/components/public/theme/utils";
import { Link } from "@/i18n/navigation";
import { localized } from "@/lib/i18n/get-localized";
import type { Locale } from "@/lib/i18n/config";
import type { Service } from "@prisma/client";

type ServiceCardProps = {
  locale: Locale;
  service: Service;
  className?: string;
  variant?: "default" | "featured" | "editorial";
};

/** Presentational service card surface (no data fetching). */
export function ServiceCardSurface({
  href,
  name,
  description,
  imageUrl,
  detailsLabel,
  className,
  variant = "default",
  locale,
  seed,
}: {
  href: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  detailsLabel: string;
  className?: string;
  /** Featured = larger premium card; editorial = asymmetric architecture tile. */
  variant?: "default" | "featured" | "editorial";
  locale?: string;
  seed?: string;
}) {
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowUpLeft : ArrowUpRight;
  const wide = variant === "featured" || variant === "editorial";

  return (
    <Link
      href={href as ComponentProps<typeof Link>["href"]}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden bg-surface/30",
        "ring-1 ring-border/35 transition-[ring-color,background-color] duration-300",
        "hover:bg-surface/50 hover:ring-gold/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
        className,
      )}
    >
      <ArchitecturalImage
        src={imageUrl}
        alt={name}
        seed={seed ?? name}
        overlay
        sizes={
          wide
            ? "(max-width: 768px) 100vw, 100vw"
            : "(max-width: 768px) 100vw, 33vw"
        }
        className="aspect-[16/10] w-full"
      />
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div
          aria-hidden
          className="mb-4 h-px w-8 origin-start bg-gold/70 transition-all duration-300 group-hover:w-12 group-hover:bg-gold"
        />
        <Heading
          as="h3"
          size="h4"
          className="transition-colors group-hover:text-gold"
        >
          {name}
        </Heading>
        <Paragraph className="mt-3 flex-1 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {description}
        </Paragraph>
        <span className="mt-5 inline-flex items-center gap-2 text-sm tracking-wide text-gold">
          {detailsLabel}
          <Arrow
            className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}

export async function ServiceCard({
  locale,
  service,
  className,
  variant = "default",
}: ServiceCardProps) {
  const t = await getTranslations({ locale, namespace: "services" });
  const name = localized(service, locale, "name");
  const description = localized(service, locale, "description");

  return (
    <ServiceCardSurface
      href={`/services/${service.slug}`}
      name={name}
      description={description}
      imageUrl={service.imageUrl}
      detailsLabel={t("details")}
      className={className}
      locale={locale}
      seed={service.slug}
      variant={variant}
    />
  );
}
