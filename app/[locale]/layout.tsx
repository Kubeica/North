import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { SkipLink } from "@/components/public/SkipLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { routing } from "@/i18n/routing";
import { getCompanyProfile } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { localized } from "@/lib/i18n/get-localized";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale: localeParam } = await params;

  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const [messages, company] = await Promise.all([
    getMessages(),
    getCompanyProfile(),
  ]);

  const shortName = company
    ? localized(company, locale, "shortName") ||
      localized(company, locale, "name")
    : undefined;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <JsonLd company={company} locale={locale} />
      <SkipLink />
      <div className="flex min-h-full flex-1 flex-col">
        <Navbar shortName={shortName} logoUrl={company?.logoUrl} />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <Footer locale={locale} company={company} shortName={shortName} />
      </div>
    </NextIntlClientProvider>
  );
}
