import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import type { Role } from "@prisma/client";

import { EmptyState } from "@/components/admin/EmptyState";
import { PageHeader } from "@/components/admin/PageHeader";
import { Pagination } from "@/components/admin/Pagination";
import { SearchFilters } from "@/components/admin/SearchFilters";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { UserRowActions } from "@/components/admin/UserRowActions";
import { Button } from "@/components/ui/button";
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
import { userService } from "@/src/domain/user/service";

export const metadata = { title: "Users" };

const PAGE_SIZE = 20;

type SearchParams = Promise<{
  q?: string;
  role?: string;
  active?: string;
  page?: string;
}>;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const current = await requireSession();
  if (!can(current.role, "users:read")) redirect("/admin/dashboard");

  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const q = sp.q?.trim() ?? "";
  const role = sp.role as Role | undefined;
  const active =
    sp.active === "true" ? true : sp.active === "false" ? false : undefined;

  const { items: users, total } = await userService.list({
    q,
    role,
    active,
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <div>
      <PageHeader
        title="Users"
        description="CMS accounts — admin only."
        actions={
          <Button render={<Link href="/admin/users/new" />}>
            <Plus data-icon="inline-start" />
            New user
          </Button>
        }
      />

      <Suspense fallback={null}>
        <SearchFilters
          placeholder="Search users…"
          filters={[
            {
              name: "role",
              label: "Role",
              options: [
                { value: "ADMIN", label: "Admin" },
                { value: "EDITOR", label: "Editor" },
              ],
            },
            {
              name: "active",
              label: "Status",
              options: [
                { value: "true", label: "Active" },
                { value: "false", label: "Inactive" },
              ],
            },
          ]}
        />
      </Suspense>

      {users.length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <div className="rounded-xl border border-border bg-surface/40">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={user.role} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={user.active ? "ACTIVE" : "INACTIVE"}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(user.createdAt, "PP")}
                  </TableCell>
                  <TableCell>
                    <UserRowActions
                      id={user.id}
                      active={user.active}
                      isSelf={user.id === current.id}
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
        basePath="/admin/users"
        searchParams={{ q: sp.q, role: sp.role, active: sp.active }}
      />
    </div>
  );
}
