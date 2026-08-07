import { getTranslations } from "next-intl/server";

import { ContactCard } from "@/components/public/ContactCard";
import { SocialLinks, type SocialLink } from "@/components/public/SocialLinks";
import { Logo } from "@/components/layout/Logo";
import { Link } from "@/i18n/navigation";
import { localized } from "@/lib/i18n/get-localized";
import type { Locale } from "@/lib/i18n/config";
import type { CompanyProfile } from "@prisma/client";

type FooterProps = {
  locale: Locale;
  company: CompanyProfile | null;
  shortName?: string;
};

const QUICK_LINKS = [
  { href: "/about" as const, key: "about" as const },
  { href: "/services" as const, key: "services" as const },
  { href: "/projects" as const, key: "projects" as const },
  { href: "/contact" as const, key: "contact" as const },
];

function companySocialLinks(company: CompanyProfile | null): SocialLink[] {
  if (!company) return [];
  const links: SocialLink[] = [];
  const record = company as CompanyProfile & Record<string, unknown>;
  const candidates: Array<[string, string]> = [
    ["facebook", "facebookUrl"],
    ["instagram", "instagramUrl"],
    ["linkedin", "linkedinUrl"],
    ["twitter", "twitterUrl"],
    ["youtube", "youtubeUrl"],
  ];
  for (const [network, key] of candidates) {
    const value = record[key];
    if (typeof value === "string" && value) {
      links.push({ network, href: value });
    }
  }
  return links;
}

export async function Footer({ locale, company, shortName }: FooterProps) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const year = new Date().getFullYear();

  const companyName = company
    ? localized(company, locale, "name")
    : t("company");
  const address = company ? localized(company, locale, "address") : "";
  const email = company?.email ?? "";
  const phone = company?.phone ?? "";
  const social = companySocialLinks(company);

  return (
    <footer className="border-t border-border bg-surface">
      <div className="nm-container nm-section grid gap-12 md:grid-cols-3 md:gap-8">
        <div className="space-y-4">
          <Logo shortName={shortName ?? companyName} />
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {company
              ? localized(company, locale, "shortDescription")
              : companyName}
          </p>
          <SocialLinks links={social} />
        </div>

        <div>
          <h2 className="mb-4 text-sm font-semibold tracking-wide text-gold">
            {t("quickLinks")}
          </h2>
          <ul className="space-y-2">
            {QUICK_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {tNav(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <ContactCard
          title={t("contact")}
          address={address || null}
          phone={phone || null}
          email={email || null}
          className="border-0 bg-transparent p-0 md:p-0"
        />
      </div>

      <div className="border-t border-border">
        <div className="nm-container flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {companyName}. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
