"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { ClientLogo } from "@/components/public/ClientLogo";
import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { SectionTitle } from "@/components/public/layout/SectionTitle";
import type { Client } from "@prisma/client";

type ClientsMarqueeProps = {
  clients: Client[];
};

export function ClientsMarquee({ clients }: ClientsMarqueeProps) {
  const t = useTranslations("home");
  const reduceMotion = useReducedMotion();

  if (clients.length === 0) return null;

  const row = [...clients, ...clients];

  return (
    <Section tone="dark" id="clients" padded={false} className="overflow-hidden">
      <Container className="nm-section pb-8 md:pb-10">
        <SectionTitle
          title={t("trustedClients")}
          description={t("trustedClientsSubtitle")}
        />
      </Container>

      <div className="relative pb-[var(--nm-section-y)] md:pb-[var(--nm-section-y-md)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 start-0 z-10 w-16 bg-gradient-to-r from-background to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 end-0 z-10 w-16 bg-gradient-to-l from-background to-transparent"
        />

        <ul className="sr-only">
          {clients.map((client) => (
            <li key={client.id}>{client.name}</li>
          ))}
        </ul>

        {reduceMotion ? (
          <Container>
            <div className="flex flex-wrap items-center justify-center gap-8" aria-hidden>
              {clients.map((client) => (
                <ClientLogo
                  key={client.id}
                  name={client.name}
                  logoUrl={client.logoUrl}
                />
              ))}
            </div>
          </Container>
        ) : (
          <motion.div
            className="flex w-max gap-12 px-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: Math.max(22, clients.length * 4),
              ease: "linear",
              repeat: Infinity,
            }}
            aria-hidden
          >
            {row.map((client, i) => (
              <ClientLogo
                key={`${client.id}-${i}`}
                name={client.name}
                logoUrl={client.logoUrl}
              />
            ))}
          </motion.div>
        )}
      </div>
    </Section>
  );
}
