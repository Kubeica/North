import { getTranslations } from "next-intl/server";

import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { SectionTitle } from "@/components/public/layout/SectionTitle";
import { Reveal } from "@/components/public/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/public/motion/Stagger";
import { TeamMemberCard } from "@/components/public/TeamMemberCard";
import { localized } from "@/lib/i18n/get-localized";
import type { Locale } from "@/lib/i18n/config";
import type { TeamMember } from "@prisma/client";

type AboutLeadershipProps = {
  locale: Locale;
  members: TeamMember[];
};

export async function AboutLeadership({
  locale,
  members,
}: AboutLeadershipProps) {
  const t = await getTranslations({ locale, namespace: "about" });

  if (members.length === 0) {
    return null;
  }

  return (
    <Section tone="surface" id="leadership" padded={false}>
      <Container className="nm-section">
        <Reveal>
          <SectionTitle
            title={t("leadershipTitle")}
            description={t("leadershipSubtitle")}
            className="mb-12"
          />
        </Reveal>

        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member) => (
            <StaggerItem key={member.id}>
              <TeamMemberCard
                name={localized(member, locale, "name")}
                position={localized(member, locale, "position")}
                bio={localized(member, locale, "bio") || null}
                imageUrl={member.imageUrl}
                linkedInUrl={member.linkedin}
                email={member.email}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
