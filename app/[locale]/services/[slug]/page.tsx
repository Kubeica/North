import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/Reveal";
import { ArchitecturalImage } from "@/components/public/media/ArchitecturalImage";
import { CtaSection } from "@/components/public/CtaSection";
import { Link } from "@/i18n/navigation";
import { getCompanyProfile, getServiceBySlug } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { localized } from "@/lib/i18n/get-localized";
import { resolveServiceImageUrl } from "@/lib/media/public-assets";
import { buildPageMetadata } from "@/lib/seo/metadata";

/** ISR — align with other public detail pages. */
export const revalidate = 60;

type ServiceDetailProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: ServiceDetailProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const service = await getServiceBySlug(slug);
  if (!service) return {};

  return buildPageMetadata({
    title: localized(service, locale, "name"),
    description: localized(service, locale, "description").slice(0, 160),
    locale,
    path: `/${locale}/services/${slug}`,
    imageUrl: resolveServiceImageUrl(service.imageUrl, service.slug),
  });
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const [t, tCta, service, company] = await Promise.all([
    getTranslations({ locale, namespace: "services" }),
    getTranslations({ locale, namespace: "cta" }),
    getServiceBySlug(slug),
    getCompanyProfile(),
  ]);
  if (!service) notFound();

  const name = localized(service, locale, "name");
  const description = localized(service, locale, "description");
  const heroFallback = company?.heroImageUrl;

  return (
    <>
      <section className="section-pad pt-28 lg:pt-32">
        <div className="container-nm max-w-4xl">
          <Reveal>
            <p className="text-sm text-gold">
              <Link href="/services" className="hover:text-gold-light">
                {t("title")}
              </Link>
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              {name}
            </h1>
          </Reveal>

          <Reveal delay={0.08}>
            <ArchitecturalImage
              src={service.imageUrl ?? heroFallback}
              alt={name}
              seed={service.slug}
              priority
              overlay
              sizes="(max-width: 1024px) 100vw, 896px"
              className="mt-10 aspect-[16/9]"
            />
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-10 text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
              {description}
            </p>
            <Link
              href="/contact"
              className="mt-10 inline-flex h-11 items-center rounded-sm bg-gold px-6 text-sm font-medium text-primary-foreground hover:bg-gold-light"
            >
              {tCta("requestQuote")}
            </Link>
          </Reveal>
        </div>
      </section>
      <CtaSection
        locale={locale}
        imageUrl={resolveServiceImageUrl(service.imageUrl, service.slug)}
      />
    </>
  );
}
