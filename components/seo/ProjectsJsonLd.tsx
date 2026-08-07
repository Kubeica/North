import type { Locale } from "@/lib/i18n/config";

type BreadcrumbJsonLdItem = {
  name: string;
  path: string;
};

type ProjectListJsonItem = {
  name: string;
  description: string;
  slug: string;
  imageUrl?: string | null;
  dateCompleted?: string | null;
};

type ProjectsJsonLdProps = {
  locale: Locale;
  title: string;
  description: string;
  imageUrl?: string | null;
  breadcrumb: BreadcrumbJsonLdItem[];
  projects: ProjectListJsonItem[];
};

function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

function absoluteUrl(pathOrUrl?: string | null): string | undefined {
  if (!pathOrUrl) return undefined;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const base = siteUrl();
  return `${base}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * CollectionPage + ItemList of CreativeWork/projects + BreadcrumbList.
 * Organization is provided by the locale layout `JsonLd`.
 */
export function ProjectsJsonLd({
  locale,
  title,
  description,
  imageUrl,
  breadcrumb,
  projects,
}: ProjectsJsonLdProps) {
  const base = siteUrl();
  const url = `${base}/${locale}/projects`;
  const image = absoluteUrl(imageUrl);

  const collectionPage: Record<string, unknown> = {
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name: title,
    description,
    isPartOf: { "@id": `${base}/#website` },
    about: { "@id": `${base}/#organization` },
    inLanguage: locale,
  };

  if (image) {
    collectionPage.primaryImageOfPage = {
      "@type": "ImageObject",
      url: image,
    };
  }

  const itemList = {
    "@type": "ItemList",
    "@id": `${url}#project-list`,
    itemListElement: projects.map((project, index) => {
      const projectUrl = `${base}/${locale}/projects/${project.slug}`;
      const node: Record<string, unknown> = {
        "@type": "CreativeWork",
        "@id": `${projectUrl}#project`,
        name: project.name,
        description: project.description,
        url: projectUrl,
        creator: { "@id": `${base}/#organization` },
      };
      const projectImage = absoluteUrl(project.imageUrl);
      if (projectImage) node.image = projectImage;
      if (project.dateCompleted) node.dateCreated = project.dateCompleted;

      return {
        "@type": "ListItem",
        position: index + 1,
        item: node,
      };
    }),
  };

  const breadcrumbList = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: breadcrumb.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [collectionPage, itemList, breadcrumbList],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(graph) }}
    />
  );
}
