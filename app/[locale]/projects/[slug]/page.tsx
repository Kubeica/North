import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { LightboxGallery } from "@/components/public/LightboxGallery";
import { PageHero } from "@/components/public/PageHero";
import { ProjectDetailHighlights } from "@/components/public/ProjectDetailHighlights";
import { ProjectDetailKeyFacts } from "@/components/public/ProjectDetailKeyFacts";
import { ProjectDetailOverview } from "@/components/public/ProjectDetailOverview";
import { ProjectDetailRelated } from "@/components/public/ProjectDetailRelated";
import { ProjectDetailScope } from "@/components/public/ProjectDetailScope";
import { ProjectStatusBadge } from "@/components/public/ProjectStatusBadge";
import { Container } from "@/components/public/layout/Container";
import { Section } from "@/components/public/layout/Section";
import { SectionTitle } from "@/components/public/layout/SectionTitle";
import { Reveal } from "@/components/public/motion/Reveal";
import { CTASection } from "@/components/public/sections/CTASection";
import { ProjectDetailJsonLd } from "@/components/seo/ProjectDetailJsonLd";
import {
  getCompanyProfile,
  getProjectBySlug,
  getRelatedProjects,
} from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { localized } from "@/lib/i18n/get-localized";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { formatDate } from "@/lib/utils";

/** ISR — CMS content can lag up to 60s. */
export const revalidate = 60;

type ProjectDetailProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: ProjectDetailProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const [project, company] = await Promise.all([
    getProjectBySlug(slug),
    getCompanyProfile(),
  ]);
  if (!project) return {};

  const title =
    localized(project, locale, "seoTitle") ||
    localized(project, locale, "title");
  const description =
    localized(project, locale, "seoDescription") ||
    localized(project, locale, "summary") ||
    localized(project, locale, "description").slice(0, 160);
  const siteName = company
    ? localized(company, locale, "name")
    : "Northern Meteor Construction";

  return buildPageMetadata({
    title,
    description,
    locale,
    path: `/${locale}/projects/${slug}`,
    imageUrl: project.coverImageUrl,
    siteName,
  });
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const [project, t, tNav, tA11y, tCta] = await Promise.all([
    getProjectBySlug(slug),
    getTranslations({ locale, namespace: "projects" }),
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "a11y" }),
    getTranslations({ locale, namespace: "cta" }),
  ]);

  if (!project) notFound();

  const related = await getRelatedProjects(project.id, project.categoryId, 3);

  const title = localized(project, locale, "title");
  const summary = localized(project, locale, "summary");
  const description = localized(project, locale, "description");
  const location = localized(project, locale, "location");
  const scope = localized(project, locale, "scope");
  const category = project.category
    ? localized(project.category, locale, "name")
    : null;
  const statusLabel = t(`status.${project.status}`);
  const seoDescription =
    localized(project, locale, "seoDescription") ||
    summary ||
    description.slice(0, 160);

  const startDate = project.startDate
    ? formatDate(project.startDate, "MMMM yyyy", locale)
    : null;
  const completionDate = project.completionDate
    ? formatDate(project.completionDate, "MMMM yyyy", locale)
    : null;

  const keyFacts = [
    ...(project.client?.name
      ? [{ label: t("client"), value: project.client.name }]
      : []),
    ...(location ? [{ label: t("location"), value: location }] : []),
    ...(category ? [{ label: t("category"), value: category }] : []),
    { label: t("statusLabel"), value: statusLabel },
    ...(startDate ? [{ label: t("startDate"), value: startDate }] : []),
    ...(completionDate
      ? [{ label: t("completionDate"), value: completionDate }]
      : []),
  ];

  const galleryItems = project.images.map((image, index) => ({
    src: image.url,
    alt:
      localized(image, locale, "alt") ||
      t("detail.galleryImageAlt", { title, index: index + 1 }),
  }));

  return (
    <>
      <ProjectDetailJsonLd
        locale={locale}
        title={title}
        description={seoDescription}
        slug={slug}
        imageUrl={project.coverImageUrl}
        datePublished={project.createdAt?.toISOString?.() ?? null}
        dateCompleted={
          project.completionDate
            ? project.completionDate.toISOString()
            : null
        }
        location={location || null}
        clientName={project.client?.name ?? null}
        breadcrumb={[
          { name: tNav("home"), path: `/${locale}` },
          { name: t("title"), path: `/${locale}/projects` },
          { name: title, path: `/${locale}/projects/${slug}` },
        ]}
      />

      <PageHero
        title={title}
        description={summary || undefined}
        imageUrl={project.coverImageUrl}
        imageAlt={title}
        breadcrumb={[
          { label: tNav("home"), href: "/" },
          { label: t("title"), href: "/projects" },
          { label: title },
        ]}
        breadcrumbLabel={tA11y("breadcrumb")}
        rtlBreadcrumb={locale === "ar"}
        className="min-h-[52dvh] md:min-h-[58dvh]"
      >
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <ProjectStatusBadge status={project.status} label={statusLabel} />
          {project.client?.name ? (
            <span className="text-sm text-muted-foreground">
              <span className="text-foreground/80">{t("client")}: </span>
              {project.client.name}
            </span>
          ) : null}
          {location ? (
            <span className="text-sm text-muted-foreground">
              <span className="text-foreground/80">{t("location")}: </span>
              {location}
            </span>
          ) : null}
          {completionDate ? (
            <span className="text-sm text-muted-foreground">
              <span className="text-foreground/80">{t("completionDate")}: </span>
              {completionDate}
            </span>
          ) : null}
        </div>
      </PageHero>

      <ProjectDetailOverview
        locale={locale}
        summary={summary}
        description={description}
        scope={scope}
      />

      <ProjectDetailKeyFacts locale={locale} items={keyFacts} />

      {galleryItems.length > 0 ? (
        <Section tone="dark" id="gallery" padded={false}>
          <Container className="nm-section">
            <Reveal>
              <SectionTitle
                title={t("gallery")}
                description={t("detail.gallerySubtitle")}
                className="mb-10"
              />
            </Reveal>
            <LightboxGallery
              items={galleryItems}
              openLabel={t("detail.viewImage")}
              closeLabel={t("detail.closeLightbox")}
              dialogLabel={t("detail.lightboxLabel")}
            />
          </Container>
        </Section>
      ) : null}

      <ProjectDetailScope locale={locale} scope={scope} />

      <ProjectDetailHighlights locale={locale} />

      <ProjectDetailRelated locale={locale} projects={related} />

      <CTASection
        title={t("detail.ctaTitle")}
        description={t("detail.ctaSubtitle")}
        primaryAction={{ label: tCta("contactUs"), href: "/contact" }}
        secondaryAction={{
          label: t("detail.exploreMore"),
          href: "/projects",
        }}
        className="bg-navy"
      />
    </>
  );
}
