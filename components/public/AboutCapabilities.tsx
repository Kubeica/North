import {
  Building2,
  ClipboardList,
  Factory,
  HardHat,
  LandPlot,
  Route,
  Settings2,
  Wrench,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { FeatureCard } from "@/components/public/FeatureCard";
import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { SectionTitle } from "@/components/public/layout/SectionTitle";
import { Reveal } from "@/components/public/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/public/motion/Stagger";
import { Paragraph } from "@/components/public/typography/Paragraph";
import { localized } from "@/lib/i18n/get-localized";
import type { Locale } from "@/lib/i18n/config";
import type { CompanyProfile } from "@prisma/client";

type AboutCapabilitiesProps = {
  locale: Locale;
  company: CompanyProfile | null;
  title?: string;
  description?: string;
  id?: string;
};

const CAPABILITIES = [
  { key: "commercial" as const, icon: Building2 },
  { key: "industrial" as const, icon: Factory },
  { key: "infrastructure" as const, icon: LandPlot },
  { key: "civil" as const, icon: HardHat },
  { key: "roads" as const, icon: Route },
  { key: "mep" as const, icon: Settings2 },
  { key: "maintenance" as const, icon: Wrench },
  { key: "projectManagement" as const, icon: ClipboardList },
];

export async function AboutCapabilities({
  locale,
  company,
  title,
  description,
  id = "capabilities",
}: AboutCapabilitiesProps) {
  const t = await getTranslations({ locale, namespace: "about" });
  const cmsCapabilities = company
    ? localized(company, locale, "capabilities")
    : null;
  const showCmsIntro = !title && !description;

  return (
    <Section tone="dark" id={id} padded={false}>
      <Container className="nm-section">
        <Reveal>
          <SectionTitle
            title={title ?? t("capabilitiesTitle")}
            description={description ?? t("capabilitiesSubtitle")}
            className="mb-6"
          />
          {showCmsIntro && cmsCapabilities ? (
            <Paragraph className="mb-12 max-w-2xl text-muted-foreground">
              {cmsCapabilities}
            </Paragraph>
          ) : null}
        </Reveal>

        <Stagger
          className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-4 ${showCmsIntro && cmsCapabilities ? "" : "mt-12"}`}
        >
          {CAPABILITIES.map((item) => (
            <StaggerItem key={item.key}>
              <FeatureCard
                icon={item.icon}
                title={t(`capabilityItems.${item.key}.title`)}
                description={t(`capabilityItems.${item.key}.body`)}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
