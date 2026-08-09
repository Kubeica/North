import { revalidatePath, updateTag } from "next/cache";

/** Invalidate public CMS caches after admin mutations (Server Actions). */
export function revalidatePublicCms(options?: {
  projects?: boolean;
  services?: boolean;
  home?: boolean;
  about?: boolean;
  contact?: boolean;
}) {
  const {
    projects = false,
    services = false,
    home = false,
    about = false,
    contact = false,
  } = options ?? {};

  if (projects) {
    updateTag("projects");
    revalidatePath("/[locale]/projects", "page");
    revalidatePath("/[locale]/projects/[slug]", "page");
  }
  if (services) {
    updateTag("services");
    revalidatePath("/[locale]/services", "page");
    revalidatePath("/[locale]/services/[slug]", "page");
  }
  if (home || projects || services) {
    revalidatePath("/[locale]", "page");
  }
  if (about) {
    revalidatePath("/[locale]/about", "page");
  }
  if (contact) {
    revalidatePath("/[locale]/contact", "page");
  }
  revalidatePath("/", "layout");
  revalidatePath("/[locale]", "layout");
}
