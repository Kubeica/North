import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageHero } from "@/components/public/PageHero";
import { ProjectCard } from "@/components/public/ProjectCard";
import { ProjectGrid } from "@/components/public/ProjectGrid";
import { ProjectsFeaturedShowcase } from "@/components/public/ProjectsFeaturedShowcase";
import { ProjectsFilter } from "@/components/public/ProjectsFilter";
import { ProjectsIntro } from "@/components/public/ProjectsIntro";
import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { SectionTitle } from "@/components/public/layout/SectionTitle";
import { Reveal } from "@/components/public/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/public/motion/Stagger";
import { CTASection } from "@/components/public/sections/CTASection";
import { StatsSection } from "@/components/public/StatsSection";
import { Paragraph } from "@/components/public/typography/Paragraph";
import { ProjectsJsonLd } from "@/components/seo/ProjectsJsonLd";
import { Link } from "@/i18n/navigation";
import {
  getCompanyProfile,
  getFeaturedProjects,
  getProjectCategories,
  getProjectLocations,
  getProjects,
  getStatistics,
} from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { localized } from "@/lib/i18n/get-localized";
import { buildPageMetadata } from "@/lib/seo/metadata";

/** ISR — CMS content can lag up to 60s. */
export const revalidate = 60;

type ProjectsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string;
    category?: string;
    status?: string;
    location?: string;
    featured?: string;
    page?: string;
  }>;
};

export async function generateMetadata({ params }: ProjectsPageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const t = await getTranslations({ locale, namespace: "projects" });
  const company = await getCompanyProfile();
  const siteName = company
    ? localized(company, locale, "name")
    : "Northern Meteor Construction";

  return buildPageMetadata({
    title: t("title"),
    description: t("seoDescription") || t("subtitle"),
    locale,
    path: `/${locale}/projects`,
    imageUrl: company?.heroImageUrl,
    siteName,
  });
}

export default async function ProjectsPage({
  params,
  searchParams,
}: ProjectsPageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const featuredOnly = sp.featured === "true";

  const [
    company,
    categories,
    locations,
    result,
    featuredProjects,
    statistics,
    t,
    tNav,
    tA11y,
    tCta,
  ] = await Promise.all([
    getCompanyProfile(),
    getProjectCategories(),
    getProjectLocations(),
    getProjects({
      q: sp.q,
      category: sp.category,
      status: sp.status,
      location: sp.location,
      featured: featuredOnly || undefined,
      page,
      pageSize: 9,
    }),
    getFeaturedProjects(1),
    getStatistics(),
    getTranslations({ locale, namespace: "projects" }),
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "a11y" }),
    getTranslations({ locale, namespace: "cta" }),
  ]);

  const brandName = company
    ? localized(company, locale, "shortName") ||
      localized(company, locale, "name")
    : t("title");

  const heroDescription =
    (company ? localized(company, locale, "shortDescription") : "") ||
    t("subtitle");

  const totalPages = Math.max(1, Math.ceil(result.total / result.pageSize));
  const showcase = featuredProjects[0] ?? null;

  function pageHref(target: number) {
    const params = new URLSearchParams();
    if (sp.q) params.set("q", sp.q);
    if (sp.category) params.set("category", sp.category);
    if (sp.status) params.set("status", sp.status);
    if (sp.location) params.set("location", sp.location);
    if (featuredOnly) params.set("featured", "true");
    if (target > 1) params.set("page", String(target));
    const query = params.toString();
    return query ? `/projects?${query}` : "/projects";
  }

  return (
    <>
      <ProjectsJsonLd
        locale={locale}
        title={t("title")}
        description={t("seoDescription")}
        imageUrl={company?.heroImageUrl}
        breadcrumb={[
          { name: tNav("home"), path: `/${locale}` },
          { name: t("title"), path: `/${locale}/projects` },
        ]}
        projects={result.items.map((project) => ({
          name: localized(project, locale, "title"),
          description:
            localized(project, locale, "summary") ||
            localized(project, locale, "title"),
          slug: project.slug,
          imageUrl: project.coverImageUrl,
          dateCompleted: project.completionDate
            ? project.completionDate.toISOString()
            : null,
        }))}
      />

      <PageHero
        title={t("title")}
        description={heroDescription}
        eyebrow={brandName}
        imageUrl={company?.heroImageUrl}
        imageAlt={`${brandName} — ${t("title")}`}
        breadcrumb={[
          { label: tNav("home"), href: "/" },
          { label: t("title") },
        ]}
        breadcrumbLabel={tA11y("breadcrumb")}
        rtlBreadcrumb={locale === "ar"}
      />

      <ProjectsIntro locale={locale} company={company} />

      <Section tone="surface" id="portfolio" padded={false}>
        <Container className="nm-section">
          <Reveal>
            <SectionTitle
              title={t("gridTitle")}
              description={t("gridSubtitle")}
              className="mb-8"
            />
          </Reveal>

          <ProjectsFilter
            categories={categories.map((c) => ({
              slug: c.slug,
              name: localized(c, locale, "name"),
            }))}
            locations={locations.map((loc) => ({
              value: loc.value,
              label: locale === "ar" ? loc.labelAr : loc.labelEn,
            }))}
            currentQ={sp.q}
            currentCategory={sp.category}
            currentStatus={sp.status}
            currentLocation={sp.location}
            currentFeatured={featuredOnly}
          />

          {result.items.length === 0 ? (
            <Paragraph className="mt-12 text-muted-foreground">
              {t("empty")}
            </Paragraph>
          ) : (
            <Stagger className="mt-12">
              <ProjectGrid>
                {result.items.map((project) => (
                  <StaggerItem key={project.id}>
                    <ProjectCard locale={locale} project={project} />
                  </StaggerItem>
                ))}
              </ProjectGrid>
            </Stagger>
          )}

          {totalPages > 1 ? (
            <nav
              className="mt-14 flex items-center justify-center gap-3"
              aria-label={t("paginationLabel")}
            >
              {page > 1 ? (
                <Link
                  href={pageHref(page - 1)}
                  className="rounded-md border border-border px-4 py-2 text-sm transition-colors hover:border-gold/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  {t("previousPage")}
                </Link>
              ) : null}
              <span className="text-sm text-muted-foreground" aria-current="page">
                {t("pageOf", { page, total: totalPages })}
              </span>
              {page < totalPages ? (
                <Link
                  href={pageHref(page + 1)}
                  className="rounded-md border border-border px-4 py-2 text-sm transition-colors hover:border-gold/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  {t("nextPage")}
                </Link>
              ) : null}
            </nav>
          ) : null}
        </Container>
      </Section>

      <ProjectsFeaturedShowcase locale={locale} project={showcase} />

      <StatsSection
        locale={locale}
        statistics={statistics}
        title={t("statsTitle")}
        description={t("statsSubtitle")}
        id="portfolio-stats"
      />

      <CTASection
        title={t("ctaTitle")}
        description={t("ctaSubtitle")}
        primaryAction={{ label: tCta("contactUs"), href: "/contact" }}
        secondaryAction={{
          label: tCta("exploreServices"),
          href: "/services",
        }}
        className="bg-navy"
      />
    </>
  );
}
