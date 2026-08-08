import Link from "next/link";
import { Plus } from "lucide-react";
import { Suspense } from "react";

import { archiveTeamMember } from "@/app/actions/team";
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
import { teamService } from "@/src/domain/team/service";

export const metadata = { title: "Team" };

const PAGE_SIZE = 20;

type SearchParams = Promise<{ q?: string; published?: string; page?: string }>;

export default async function AdminTeamPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requirePermission("team:read");
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const q = sp.q?.trim() ?? "";
  const published =
    sp.published === "true" ? true : sp.published === "false" ? false : undefined;

  const { items: members, total } = await teamService.list({
    q,
    published,
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <div>
      <PageHeader
        title="Team"
        description="Leadership and team profiles."
        actions={
          <Button render={<Link href="/admin/team/new" />}>
            <Plus data-icon="inline-start" />
            New member
          </Button>
        }
      />

      <Suspense fallback={null}>
        <SearchFilters
          placeholder="Search team…"
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

      {members.length === 0 ? (
        <EmptyState
          title="No team members"
          action={
            <Button render={<Link href="/admin/team/new" />}>New member</Button>
          }
        />
      ) : (
        <div className="rounded-xl border border-border bg-surface/40">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Link
                      href={`/admin/team/${member.id}/edit`}
                      className="font-medium hover:text-gold"
                    >
                      {member.nameEn}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {member.positionEn}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={member.published ? "PUBLISHED" : "DRAFT"}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(member.createdAt, "PP")}
                  </TableCell>
                  <TableCell>
                    <RowActions
                      id={member.id}
                      editHref={`/admin/team/${member.id}/edit`}
                      archiveAction={archiveTeamMember}
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
        basePath="/admin/team"
        searchParams={{ q: sp.q, published: sp.published }}
      />
    </div>
  );
}
