"use client";

import { useTranslations } from "next-intl";

import { ClientLogo } from "@/components/public/ClientLogo";
import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { Caption } from "@/components/public/typography/Caption";
import { Heading } from "@/components/public/typography/Heading";
import { Lead } from "@/components/public/typography/Lead";

/** Serializable DTO — never pass full Prisma Client rows across the RSC boundary. */
export type ClientsMarqueeItem = {
  id: string;
  name: string;
  logoUrl?: string | null;
};

type ClientsMarqueeProps = {
  clients: ClientsMarqueeItem[];
};

/** Compact partner-mark grid: 2-col mobile, 4-col desktop. */
export function ClientsMarquee({ clients }: ClientsMarqueeProps) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");

  if (clients.length === 0) return null;

  return (
    <Section tone="dark" id="clients" padded={false}>
      <Container className="nm-section pt-8 md:pt-10">
        <div className="mb-5 max-w-2xl md:mb-6">
          <Caption className="tracking-[0.2em] text-gold uppercase">
            {t("trustedClientsEyebrow")}
          </Caption>
          <Heading as="h2" size="h2" className="mt-2.5 text-balance">
            {t("trustedClients")}
          </Heading>
          <Lead className="mt-2 max-w-xl text-sm md:text-base">
            {t("trustedClientsSubtitle")}
          </Lead>
          <p className="mt-2.5 inline-flex items-center gap-2 text-xs tracking-[0.14em] text-muted-foreground uppercase">
            <span
              aria-hidden
              className="inline-block size-1.5 rounded-full bg-gold/70"
            />
            {tCommon("demoBadge")}
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-px border border-border/50 bg-border/50 lg:grid-cols-4">
          {clients.map((client) => (
            <li
              key={client.id}
              className="flex items-center justify-center bg-background/90 px-3 py-4 transition-colors duration-300 hover:bg-surface sm:py-5"
            >
              <ClientLogo name={client.name} logoUrl={client.logoUrl} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
