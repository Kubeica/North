import { redirect } from "next/navigation";
import { Suspense } from "react";

import { EmptyState } from "@/components/admin/EmptyState";
import { PageHeader } from "@/components/admin/PageHeader";
import { Pagination } from "@/components/admin/Pagination";
import { SearchFilters } from "@/components/admin/SearchFilters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireSession } from "@/lib/auth/session";
import { can } from "@/lib/permissions";
import { formatDate } from "@/lib/utils";
import { auditService } from "@/src/domain/audit/service";

export const metadata = { title: "Audit logs" };

const PAGE_SIZE = 30;

type SearchParams = Promise<{
  q?: string;
  action?: string;
  entity?: string;
  page?: string;
}>;

export default async function AdminAuditLogsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await requireSession();
  if (!can(user.role, "audit:read")) redirect("/admin/dashboard");

  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const q = sp.q?.trim() ?? "";
  const action = sp.action?.trim() ?? "";
  const entity = sp.entity?.trim() ?? "";

  const [listResult, actionOptions, entityOptions] = await Promise.all([
    auditService.list({
      q,
      action,
      entity,
      page,
      pageSize: PAGE_SIZE,
    }),
    auditService.listDistinctActions(),
    auditService.listDistinctEntities(),
  ]);

  const { items: logs, total } = listResult;

  return (
    <div>
      <PageHeader
        title="Audit logs"
        description="Immutable activity trail for CMS changes."
      />

      <Suspense fallback={null}>
        <SearchFilters
          placeholder="Search action, entity, or user…"
          filters={[
            {
              name: "action",
              label: "Action",
              options: actionOptions.map((a) => ({
                value: a.action,
                label: a.action,
              })),
            },
            {
              name: "entity",
              label: "Entity",
              options: entityOptions
                .filter((e) => e.entity)
                .map((e) => ({
                  value: e.entity!,
                  label: e.entity!,
                })),
            },
          ]}
        />
      </Suspense>

      {logs.length === 0 ? (
        <EmptyState title="No audit events" />
      ) : (
        <div className="rounded-xl border border-border bg-surface/40">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {formatDate(log.createdAt, "PPp")}
                  </TableCell>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell>
                    <p>{log.entity ?? "—"}</p>
                    {log.entityId ? (
                      <p className="max-w-[140px] truncate text-xs text-muted-foreground">
                        {log.entityId}
                      </p>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {log.user?.name ?? "System"}
                    {log.user?.email ? (
                      <p className="text-xs">{log.user.email}</p>
                    ) : null}
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate text-xs text-muted-foreground">
                    {log.metadata
                      ? JSON.stringify(log.metadata)
                      : "—"}
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
        basePath="/admin/audit-logs"
        searchParams={{
          q: sp.q,
          action: sp.action,
          entity: sp.entity,
        }}
      />
    </div>
  );
}
