import { getTranslations } from "next-intl/server";

import { PublicButton } from "@/components/public/buttons/PublicButton";
import { ContactCard } from "@/components/public/ContactCard";
import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { MapPlaceholder } from "@/components/public/MapPlaceholder";
import { Reveal } from "@/components/public/motion/Reveal";
import { Heading } from "@/components/public/typography/Heading";
import { Lead } from "@/components/public/typography/Lead";
import { localized } from "@/lib/i18n/get-localized";
import type { Locale } from "@/lib/i18n/config";
import type { CompanyProfile } from "@prisma/client";

type ContactTeaserProps = {
  locale: Locale;
  company: CompanyProfile | null;
};

export async function ContactTeaser({
  locale,
  company,
}: ContactTeaserProps) {
  const t = await getTranslations({ locale, namespace: "home" });
  const tCta = await getTranslations({ locale, namespace: "cta" });

  const address = company ? localized(company, locale, "address") : "";
  const phone = company?.phone ?? "";
  const email = company?.email ?? "";
  const hasMapCoords =
    company?.latitude != null &&
    company?.longitude != null &&
    Number.isFinite(company.latitude) &&
    Number.isFinite(company.longitude);

  return (
    <Section tone="dark" id="contact-preview" padded={false}>
      <Container className="nm-section">
        <div
          className={
            hasMapCoords
              ? "grid gap-8 lg:grid-cols-2 lg:items-start"
              : "max-w-xl"
          }
        >
          <Reveal>
            <Heading as="h2" size="h2">
              {t("contactPreviewTitle")}
            </Heading>
            <Lead className="mt-3 max-w-lg text-sm md:text-base">
              {t("contactPreviewSubtitle")}
            </Lead>
            <div className="mt-6">
              <ContactCard
                address={address || null}
                phone={phone || null}
                email={email || null}
              >
                <div className="mt-6">
                  <PublicButton href="/contact" size="lg">
                    {tCta("sendMessage")}
                  </PublicButton>
                </div>
              </ContactCard>
            </div>
          </Reveal>

          {hasMapCoords ? (
            <Reveal>
              <MapPlaceholder
                latitude={company?.latitude}
                longitude={company?.longitude}
                label={t("mapPlaceholder")}
                unavailableLabel={t("mapUnavailable")}
              />
            </Reveal>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
