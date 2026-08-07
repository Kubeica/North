import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { ComponentProps } from "react";

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
}: {
  href: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  detailsLabel: string;
  className?: string;
  /** Featured = larger premium card for the Services page. */
  variant?: "default" | "featured";
}) {
  const featured = variant === "featured";

  return (
    <Link
      href={href as ComponentProps<typeof Link>["href"]}
      className={cn(
        "group flex h-full flex-col border border-border/60 bg-surface/40 transition-colors hover:border-gold/40 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
        featured ? "p-0" : "p-6",
        className,
      )}
    >
      {imageUrl ? (
        <div
          className={cn(
            "relative overflow-hidden bg-surface-2",
            featured
              ? "aspect-[16/9] w-full"
              : "mb-5 aspect-[16/10]",
          )}
        >
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes={
              featured
                ? "(max-width: 768px) 100vw, 50vw"
                : "(max-width: 768px) 100vw, 33vw"
            }
            loading="lazy"
            decoding="async"
            quality={featured ? 80 : 75}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ) : featured ? (
        <div
          className="aspect-[16/9] w-full bg-gradient-to-br from-navy via-surface to-background"
          aria-hidden
        />
      ) : null}
      <div className={cn(featured && "flex flex-1 flex-col p-6 md:p-8")}>
        <Heading
          as="h3"
          size={featured ? "h3" : "h4"}
          className="transition-colors group-hover:text-gold"
        >
          {name}
        </Heading>
        <Paragraph
          className={cn(
            "mt-3 flex-1",
            featured ? "text-sm line-clamp-4 md:text-base" : "text-sm line-clamp-3",
          )}
        >
          {description}
        </Paragraph>
        <span className="mt-5 text-sm text-gold">{detailsLabel}</span>
      </div>
    </Link>
  );
}

export async function ServiceCard({
  locale,
  service,
  className,
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
    />
  );
}
