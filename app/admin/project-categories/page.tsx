import Link from "next/link";
import { Plus } from "lucide-react";
import { Suspense } from "react";

import { archiveProjectCategory } from "@/app/actions/project-categories";
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
import { projectCategoryService } from "@/src/domain/project-category/service";

export const metadata = { title: "Project categories" };

const PAGE_SIZE = 20;

type SearchParams = Promise<{ q?: string; published?: string; page?: string }>;

export default async function AdminProjectCategoriesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requirePermission("projects:read");
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const q = sp.q?.trim() ?? "";
  const published =
    sp.published === "true" ? true : sp.published === "false" ? false : undefined;

  const { items: categories, total } = await projectCategoryService.list({
    q,
    published,
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <div>
      <PageHeader
        title="Project categories"
        description="Categories available in the project editor and public filters."
        actions={
          <Button render={<Link href="/admin/project-categories/new" />}>
            <Plus data-icon="inline-start" />
            New category
          </Button>
        }
      />

      <Suspense fallback={null}>
        <SearchFilters
          placeholder="Search categories…"
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

      {categories.length === 0 ? (
        <EmptyState
          title="No categories found"
          action={
            <Button render={<Link href="/admin/project-categories/new" />}>
              New category
            </Button>
          }
        />
      ) : (
        <div className="rounded-xl border border-border bg-surface/40">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name (EN)</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <Link
                      href={`/admin/project-categories/${category.id}/edit`}
                      className="font-medium hover:text-gold"
                    >
                      {category.nameEn}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {category.slug}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {category.sortOrder}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={category.published ? "PUBLISHED" : "DRAFT"}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(category.updatedAt, "PP")}
                  </TableCell>
                  <TableCell>
                    <RowActions
                      id={category.id}
                      editHref={`/admin/project-categories/${category.id}/edit`}
                      archiveAction={archiveProjectCategory}
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
        basePath="/admin/project-categories"
        searchParams={{ q: sp.q, published: sp.published }}
      />
    </div>
  );
}
