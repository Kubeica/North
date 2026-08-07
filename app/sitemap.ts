import type { MetadataRoute } from "next";

import { defaultLocale, locales } from "@/lib/i18n/config";
import { projectService } from "@/src/domain/project/service";
import { serviceService } from "@/src/domain/service/service";

function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

const STATIC_PATHS = ["", "/about", "/services", "/projects", "/contact"] as const;

function languageAlternates(path: string): Record<string, string> {
  const base = siteUrl();
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = `${base}/${locale}${path}`;
  }
  languages["x-default"] = `${base}/${defaultLocale}${path}`;
  return languages;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
        alternates: {
          languages: languageAlternates(path),
        },
      });
    }
  }

  try {
    const [projects, services] = await Promise.all([
      projectService.listForSitemap(),
      serviceService.listForSitemap(),
    ]);

    for (const locale of locales) {
      for (const project of projects) {
        const path = `/projects/${project.slug}`;
        entries.push({
          url: `${base}/${locale}${path}`,
          lastModified: project.updatedAt,
          changeFrequency: "monthly",
          priority: 0.7,
          alternates: {
            languages: languageAlternates(path),
          },
        });
      }
      for (const service of services) {
        const path = `/services/${service.slug}`;
        entries.push({
          url: `${base}/${locale}${path}`,
          lastModified: service.updatedAt,
          changeFrequency: "monthly",
          priority: 0.7,
          alternates: {
            languages: languageAlternates(path),
          },
        });
      }
    }
  } catch {
    // DB unavailable — return static routes only
  }

  return entries;
}
