import Link from "next/link";
import { Plus } from "lucide-react";
import { Suspense } from "react";

import { archiveService } from "@/app/actions/services";
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
import { serviceService } from "@/src/domain/service/service";

export const metadata = { title: "Services" };

const PAGE_SIZE = 20;

type SearchParams = Promise<{ q?: string; published?: string; page?: string }>;

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requirePermission("services:read");
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const q = sp.q?.trim() ?? "";
  const published =
    sp.published === "true" ? true : sp.published === "false" ? false : undefined;

  const { items: services, total } = await serviceService.list({
    q,
    published,
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <div>
      <PageHeader
        title="Services"
        description="Manage service offerings shown on the public site."
        actions={
          <Button render={<Link href="/admin/services/new" />}>
            <Plus data-icon="inline-start" />
            New service
          </Button>
        }
      />

      <Suspense fallback={null}>
        <SearchFilters
          placeholder="Search services…"
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

      {services.length === 0 ? (
        <EmptyState
          title="No services found"
          action={
            <Button render={<Link href="/admin/services/new" />}>
              New service
            </Button>
          }
        />
      ) : (
        <div className="rounded-xl border border-border bg-surface/40">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <Link
                      href={`/admin/services/${service.id}/edit`}
                      className="font-medium hover:text-gold"
                    >
                      {service.nameEn}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {service.slug}
                    </p>
                  </TableCell>
                  <TableCell>{service.sortOrder}</TableCell>
                  <TableCell>
                    <StatusBadge
                      status={service.published ? "PUBLISHED" : "DRAFT"}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(service.createdAt, "PP")}
                  </TableCell>
                  <TableCell>
                    <RowActions
                      viewHref={`/en/services/${service.slug}`}
                      editHref={`/admin/services/${service.id}/edit`}
                      onArchive={() => archiveService(service.id)}
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
        basePath="/admin/services"
        searchParams={{ q: sp.q, published: sp.published }}
      />
    </div>
  );
}
