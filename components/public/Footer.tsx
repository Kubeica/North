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
  const shortDescription = company
    ? localized(company, locale, "shortDescription")
    : "";

  return (
    <footer className="border-t border-border bg-background">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="nm-container grid gap-7 py-6 md:grid-cols-12 md:gap-6 md:py-7">
        <div className="space-y-2.5 md:col-span-5">
          <Logo
            shortName={shortName ?? companyName}
            logoUrl={company?.logoUrl}
            className="text-lg"
          />
          {shortDescription ? (
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {shortDescription}
            </p>
          ) : null}
          {social.length > 0 ? <SocialLinks links={social} /> : null}
        </div>

        <div className="md:col-span-3">
          <h2 className="mb-2.5 text-xs font-semibold tracking-[0.18em] text-gold uppercase">
            {t("quickLinks")}
          </h2>
          <ul className="space-y-1.5">
            {QUICK_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-gold"
                >
                  {tNav(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <ContactCard
            title={t("contact")}
            address={address || null}
            phone={phone || null}
            email={email || null}
            className="border-0 bg-transparent p-0 md:p-0"
          />
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="nm-container flex flex-col gap-1 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {companyName}. {t("rights")}
          </p>
          <p className="tracking-[0.16em] text-gold/65 uppercase">
            {locale === "ar" ? "العربية" : "English"}
          </p>
        </div>
      </div>
    </footer>
  );
}
