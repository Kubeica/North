import { unstable_cache } from "next/cache";

import { safeQuery } from "@/lib/data/safe";
import { serviceService } from "@/src/domain/service/service";

const getCachedPublishedServices = unstable_cache(
  () => serviceService.listPublished(),
  ["public-services"],
  { revalidate: 60, tags: ["services"] },
);

export async function getServices() {
  return safeQuery(() => getCachedPublishedServices(), []);
}

export async function getServiceBySlug(slug: string) {
  return safeQuery(() => serviceService.getBySlug(slug), null);
}
