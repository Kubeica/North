import Link from "next/link";
import { Plus } from "lucide-react";
import { Suspense } from "react";

import { deleteCompanyMilestone } from "@/app/actions/milestone";
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
import { milestoneService } from "@/src/domain/milestone/service";

export const metadata = { title: "Milestones" };

const PAGE_SIZE = 20;

type SearchParams = Promise<{ q?: string; published?: string; page?: string }>;

export default async function AdminMilestonesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requirePermission("milestones:read");
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const q = sp.q?.trim() ?? "";
  const published =
    sp.published === "true" ? true : sp.published === "false" ? false : undefined;

  const { items: milestones, total } = await milestoneService.list({
    q,
    published,
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <div>
      <PageHeader
        title="Milestones"
        description="Company timeline milestones shown on the About page."
        actions={
          <Button render={<Link href="/admin/milestones/new" />}>
            <Plus data-icon="inline-start" />
            New milestone
          </Button>
        }
      />

      <Suspense fallback={null}>
        <SearchFilters
          placeholder="Search milestones…"
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

      {milestones.length === 0 ? (
        <EmptyState
          title="No milestones"
          action={
            <Button render={<Link href="/admin/milestones/new" />}>
              New milestone
            </Button>
          }
        />
      ) : (
        <div className="rounded-xl border border-border bg-surface/40">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {milestones.map((milestone) => (
                <TableRow key={milestone.id}>
                  <TableCell className="font-medium text-gold">
                    {milestone.year}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/milestones/${milestone.id}/edit`}
                      className="font-medium hover:text-gold"
                    >
                      {milestone.titleEn}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {milestone.sortOrder}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={milestone.published ? "PUBLISHED" : "DRAFT"}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(milestone.updatedAt, "PP")}
                  </TableCell>
                  <TableCell>
                    <RowActions
                      id={milestone.id}
                      editHref={`/admin/milestones/${milestone.id}/edit`}
                      archiveLabel="Delete"
                      archiveAction={deleteCompanyMilestone}
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
        basePath="/admin/milestones"
        searchParams={{ q: sp.q, published: sp.published }}
      />
    </div>
  );
}
