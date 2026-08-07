import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("errors");
  const tCta = await getTranslations("cta");

  return (
    <section className="section-pad flex min-h-[60vh] items-center pt-28">
      <div className="container-nm max-w-xl">
        <h1 className="text-4xl font-semibold tracking-tight">
          {t("notFoundTitle")}
        </h1>
        <p className="mt-4 text-muted-foreground">{t("notFoundDescription")}</p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center rounded-md bg-gold px-6 text-sm font-medium text-primary-foreground hover:bg-gold-light"
        >
          {tCta("backHome")}
        </Link>
      </div>
    </section>
  );
}
