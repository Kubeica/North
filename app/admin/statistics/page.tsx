import Link from "next/link";
import { Plus } from "lucide-react";
import { Suspense } from "react";

import { archiveStatistic } from "@/app/actions/statistics";
import { EmptyState } from "@/components/admin/EmptyState";
import { PageHeader } from "@/components/admin/PageHeader";
import { Pagination } from "@/components/admin/Pagination";
import { RowActions } from "@/components/admin/RowActions";
import { SearchFilters } from "@/components/admin/SearchFilters";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requirePermission } from "@/lib/auth/session";
import { formatDate } from "@/lib/utils";
import { statisticService } from "@/src/domain/statistic/service";

export const metadata = { title: "Statistics" };

const PAGE_SIZE = 20;

type SearchParams = Promise<{ q?: string; published?: string; page?: string }>;

export default async function AdminStatisticsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requirePermission("statistics:read");
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const q = sp.q?.trim() ?? "";
  const published =
    sp.published === "true" ? true : sp.published === "false" ? false : undefined;

  const { items: statistics, total } = await statisticService.list({
    q,
    published,
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <div>
      <PageHeader
        title="Statistics"
        description="Numeric highlights shown on the public site when published."
        actions={
          <Button render={<Link href="/admin/statistics/new" />}>
            <Plus data-icon="inline-start" />
            New statistic
          </Button>
        }
      />

      <Suspense fallback={null}>
        <SearchFilters
          placeholder="Search statistics…"
          filters={[
            {
              name: "published",
              label: "Published",
              options: [
                { value: "true", label: "Published" },
                { value: "false", label: "Draft" },
              ],
            },
          ]}
        />
      </Suspense>

      {statistics.length === 0 ? (
        <EmptyState
          title="No statistics yet"
          description="Add real metrics when ready. Unpublished or empty lists stay hidden on the public site."
          action={
            <Button render={<Link href="/admin/statistics/new" />}>
              New statistic
            </Button>
          }
        />
      ) : (
        <div className="rounded-xl border border-border bg-surface/40">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Value</TableHead>
                <TableHead>Label (EN)</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statistics.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Link
                      href={`/admin/statistics/${item.id}/edit`}
                      className="font-medium hover:text-gold"
                    >
                      {item.value}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.labelEn}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.sortOrder}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={item.published ? "PUBLISHED" : "DRAFT"}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(item.updatedAt, "PP")}
                  </TableCell>
                  <TableCell>
                    <RowActions
                      id={item.id}
                      editHref={`/admin/statistics/${item.id}/edit`}
                      archiveAction={archiveStatistic}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        basePath="/admin/statistics"
        searchParams={{ q: sp.q, published: sp.published }}
      />
    </div>
  );
}
