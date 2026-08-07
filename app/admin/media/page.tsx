import { Suspense } from "react";

import { EmptyState } from "@/components/admin/EmptyState";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { PageHeader } from "@/components/admin/PageHeader";
import { Pagination } from "@/components/admin/Pagination";
import { SearchFilters } from "@/components/admin/SearchFilters";
import { requirePermission } from "@/lib/auth/session";
import { mediaService } from "@/src/domain/media/service";

export const metadata = { title: "Media" };

const PAGE_SIZE = 24;

type SearchParams = Promise<{ q?: string; page?: string }>;

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requirePermission("media:read");
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const q = sp.q?.trim() ?? "";

  const { items: media, total } = await mediaService.list({
    q,
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <div>
      <PageHeader
        title="Media"
        description="Upload and manage assets for projects and pages."
      />

      <Suspense fallback={null}>
        <SearchFilters placeholder="Search media…" />
      </Suspense>

      <MediaLibrary
        items={media.map((item) => ({
          id: item.id,
          fileName: item.fileName,
          url: item.url,
          mimeType: item.mimeType,
          size: item.size,
          createdAt: item.createdAt.toISOString(),
        }))}
      />

      {media.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title={q ? "No matching media" : "No media yet"}
            description={
              q
                ? "Try a different search."
                : "Upload images or PDFs to get started."
            }
          />
        </div>
      ) : null}

      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        basePath="/admin/media"
        searchParams={{ q: sp.q }}
      />
    </div>
  );
}
