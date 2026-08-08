import { getTranslations } from "next-intl/server";

import { PublicButton } from "@/components/public/buttons/PublicButton";
import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { Reveal } from "@/components/public/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/public/motion/Stagger";
import { ServiceCard } from "@/components/public/ServiceCard";
import { Heading } from "@/components/public/typography/Heading";
import { Lead } from "@/components/public/typography/Lead";
import type { Locale } from "@/lib/i18n/config";
import type { Service } from "@prisma/client";

type ServicesSectionProps = {
  locale: Locale;
  services: Service[];
};

export async function ServicesSection({
  locale,
  services,
}: ServicesSectionProps) {
  const t = await getTranslations({ locale, namespace: "home" });
  const tCta = await getTranslations({ locale, namespace: "cta" });

  if (services.length === 0) return null;

  const featured = services.slice(0, 6);

  return (
    <Section tone="dark" id="services" padded={false}>
      <Container className="nm-section">
        <Reveal>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-10">
            <div className="max-w-2xl">
              <Heading as="h2" size="h2" className="text-balance">
                {t("ourServices")}
              </Heading>
              <Lead className="mt-3 max-w-xl">{t("ourServicesSubtitle")}</Lead>
            </div>
            <PublicButton href="/services" variant="link" className="shrink-0">
              {tCta("exploreServices")}
            </PublicButton>
          </div>
        </Reveal>

        <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5">
          {featured.map((service) => (
            <StaggerItem key={service.id}>
              <ServiceCard
                locale={locale}
                service={service}
                variant="default"
              />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
