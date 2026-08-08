import { getTranslations } from "next-intl/server";

import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { SectionTitle } from "@/components/public/layout/SectionTitle";
import { Reveal } from "@/components/public/motion/Reveal";
import { Timeline } from "@/components/public/Timeline";
import { localized } from "@/lib/i18n/get-localized";
import type { Locale } from "@/lib/i18n/config";
import type { CompanyMilestone } from "@prisma/client";

type AboutMilestonesProps = {
  locale: Locale;
  milestones: CompanyMilestone[];
};

/** Company milestones from CMS `CompanyMilestone`. */
export async function AboutMilestones({
  locale,
  milestones,
}: AboutMilestonesProps) {
  const t = await getTranslations({ locale, namespace: "about" });

  if (milestones.length === 0) {
    return null;
  }

  const steps = milestones.map((milestone) => {
    const title = localized(milestone, locale, "title");
    const description = localized(milestone, locale, "description");
    return {
      title: `${milestone.year} — ${title}`,
      description: description || undefined,
    };
  });

  return (
    <Section tone="dark" id="timeline" padded={false}>
      <Container className="nm-section">
        <Reveal>
          <SectionTitle
            title={t("timelineTitle")}
            description={t("timelineSubtitle")}
            className="mb-12"
          />
        </Reveal>
        <Timeline
          steps={steps}
          className={
            milestones.length >= 5
              ? "lg:grid-cols-5"
              : milestones.length === 4
                ? "lg:grid-cols-4"
                : "lg:grid-cols-3"
          }
        />
      </Container>
    </Section>
  );
}
