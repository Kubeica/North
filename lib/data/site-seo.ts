import { safeQuery } from "@/lib/data/safe";
import {
  getSiteSeoDefaults,
  type SiteSeoDefaults,
} from "@/lib/seo/site-defaults";

const empty: SiteSeoDefaults = {
  titleEn: "",
  titleAr: "",
  descriptionEn: "",
  descriptionAr: "",
};

export async function getPublicSiteSeo(): Promise<SiteSeoDefaults> {
  return safeQuery(() => getSiteSeoDefaults(), empty);
}
