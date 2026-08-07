import Link from "next/link";
import { Suspense } from "react";
import type { QuoteRequestStatus } from "@prisma/client";

import { EmptyState } from "@/components/admin/EmptyState";
import { PageHeader } from "@/components/admin/PageHeader";
import { Pagination } from "@/components/admin/Pagination";
import { QuoteRequestActions } from "@/components/admin/QuoteRequestActions";
import { QuoteRequestExportButton } from "@/components/admin/QuoteRequestExportButton";
import { SearchFilters } from "@/components/admin/SearchFilters";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { requirePermission } from "@/lib/auth/session";
import { formatDate } from "@/lib/utils";
import { quoteRequestService } from "@/src/domain/quote-request/service";

export const metadata = { title: "Quote Requests" };

const PAGE_SIZE = 20;

type SearchParams = Promise<{
  q?: string;
  status?: string;
  page?: string;
}>;

export default async function AdminQuoteRequestsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requirePermission("quotes:read");
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const q = sp.q?.trim() ?? "";
  const status = (sp.status as QuoteRequestStatus | undefined) || undefined;

  const [{ items, total }, stats] = await Promise.all([
    quoteRequestService.list({
      q,
      status,
      page,
      pageSize: PAGE_SIZE,
    }),
    quoteRequestService.getDashboardStats(),
  ]);

  const statCards = [
    { label: "Total", value: stats.total },
    { label: "Open", value: stats.open },
    { label: "New", value: stats.byStatus.NEW },
    { label: "In review", value: stats.byStatus.IN_REVIEW },
    { label: "Won", value: stats.byStatus.WON },
    { label: "Archived", value: stats.byStatus.ARCHIVED },
  ];

  return (
    <div>
      <PageHeader
        title="Quote Requests"
        description="Inbound quote inquiries from the public contact form."
        actions={
          <QuoteRequestExportButton q={q || undefined} status={status} />
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-surface/40 px-4 py-3"
          >
            <p className="text-xs text-muted-foreground">{card.label}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <Suspense fallback={null}>
        <SearchFilters
          placeholder="Search company, name, email, project…"
          filters={[
            {
              name: "status",
              label: "Status",
              options: [
                { value: "NEW", label: "New" },
                { value: "IN_REVIEW", label: "In review" },
                { value: "CONTACTED", label: "Contacted" },
                { value: "WON", label: "Won" },
                { value: "LOST", label: "Lost" },
                { value: "ARCHIVED", label: "Archived" },
              ],
            },
          ]}
        />
      </Suspense>

      {items.length === 0 ? (
        <EmptyState
          title="No quote requests"
          description="New submissions from the contact page will appear here."
        />
      ) : (
        <div className="space-y-3">
          {items.map((request) => (
            <article
              key={request.id}
              className="rounded-xl border border-border bg-surface/40 p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-medium text-foreground">
                      <Link
                        href={`/admin/quote-requests/${request.id}`}
                        className="hover:text-gold"
                      >
                        {request.company}
                      </Link>
                    </h2>
                    <StatusBadge status={request.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {request.name} · {request.email}
                    {request.phone ? ` · ${request.phone}` : ""}
                  </p>
                  <p className="mt-2 text-sm text-foreground/90">
                    <span className="text-muted-foreground">Project: </span>
                    {request.projectType}
                    {request.location ? ` · ${request.location}` : ""}
                    {request.budget ? ` · ${request.budget}` : ""}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-foreground/80">
                    {request.message}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatDate(request.createdAt, "PPp")}
                  </p>
                </div>
                <QuoteRequestActions
                  id={request.id}
                  status={request.status}
                />
              </div>
            </article>
          ))}
        </div>
      )}

      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        basePath="/admin/quote-requests"
        searchParams={{ q: sp.q, status: sp.status }}
      />
    </div>
  );
}
