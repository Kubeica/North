import { getTranslations } from "next-intl/server";

import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { SectionTitle } from "@/components/public/layout/SectionTitle";
import { Reveal } from "@/components/public/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/public/motion/Stagger";
import { ServiceCardSurface } from "@/components/public/ServiceCard";
import { Paragraph } from "@/components/public/typography/Paragraph";
import { localized } from "@/lib/i18n/get-localized";
import type { Locale } from "@/lib/i18n/config";
import type { Service } from "@prisma/client";

type ServicesFeaturedProps = {
  locale: Locale;
  services: Service[];
};

/** Premium featured service grid — CMS-driven, no hardcoded services. */
export async function ServicesFeatured({
  locale,
  services,
}: ServicesFeaturedProps) {
  const t = await getTranslations({ locale, namespace: "services" });

  return (
    <Section tone="surface" id="featured-services" padded={false}>
      <Container className="nm-section">
        <Reveal>
          <SectionTitle
            title={t("featuredTitle")}
            description={t("featuredSubtitle")}
            className="mb-12"
          />
        </Reveal>

        {services.length === 0 ? (
          <Paragraph className="text-muted-foreground">{t("empty")}</Paragraph>
        ) : (
          <Stagger className="grid gap-6 md:grid-cols-2">
            {services.map((service) => {
              const name = localized(service, locale, "name");
              const description = localized(service, locale, "description");
              return (
                <StaggerItem key={service.id}>
                  <ServiceCardSurface
                    href={`/services/${service.slug}`}
                    name={name}
                    description={description}
                    imageUrl={service.imageUrl}
                    detailsLabel={t("details")}
                    variant="featured"
                  />
                </StaggerItem>
              );
            })}
          </Stagger>
        )}
      </Container>
    </Section>
  );
}
