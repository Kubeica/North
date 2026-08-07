import { getTranslations } from "next-intl/server";

import { PublicButton } from "@/components/public/buttons/PublicButton";
import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { SectionTitle } from "@/components/public/layout/SectionTitle";
import { Reveal } from "@/components/public/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/public/motion/Stagger";
import { ServiceCard } from "@/components/public/ServiceCard";
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
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionTitle
              title={t("ourServices")}
              description={t("ourServicesSubtitle")}
              className="mb-0"
            />
            <PublicButton href="/services" variant="link">
              {tCta("exploreServices")}
            </PublicButton>
          </div>
        </Reveal>

        <Stagger className="nm-grid-features">
          {featured.map((service) => (
            <StaggerItem key={service.id}>
              <ServiceCard locale={locale} service={service} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
