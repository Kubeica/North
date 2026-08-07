import Link from "next/link";
import { Plus } from "lucide-react";
import { Suspense } from "react";

import { archiveClient } from "@/app/actions/clients";
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
import { clientService } from "@/src/domain/client/service";

export const metadata = { title: "Clients" };

const PAGE_SIZE = 20;

type SearchParams = Promise<{ q?: string; published?: string; page?: string }>;

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requirePermission("clients:read");
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const q = sp.q?.trim() ?? "";
  const published =
    sp.published === "true" ? true : sp.published === "false" ? false : undefined;

  const { items: clients, total } = await clientService.list({
    q,
    published,
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <div>
      <PageHeader
        title="Clients"
        description="Client logos and profiles for the public site."
        actions={
          <Button render={<Link href="/admin/clients/new" />}>
            <Plus data-icon="inline-start" />
            New client
          </Button>
        }
      />

      <Suspense fallback={null}>
        <SearchFilters
          placeholder="Search clients…"
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

      {clients.length === 0 ? (
        <EmptyState
          title="No clients found"
          action={
            <Button render={<Link href="/admin/clients/new" />}>
              New client
            </Button>
          }
        />
      ) : (
        <div className="rounded-xl border border-border bg-surface/40">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <Link
                      href={`/admin/clients/${client.id}/edit`}
                      className="font-medium hover:text-gold"
                    >
                      {client.name}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">
                    {client.websiteUrl ?? "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={client.published ? "PUBLISHED" : "DRAFT"}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(client.createdAt, "PP")}
                  </TableCell>
                  <TableCell>
                    <RowActions
                      editHref={`/admin/clients/${client.id}/edit`}
                      onArchive={() => archiveClient(client.id)}
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
        basePath="/admin/clients"
        searchParams={{ q: sp.q, published: sp.published }}
      />
    </div>
  );
}
