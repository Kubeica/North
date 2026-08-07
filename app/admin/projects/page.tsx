import Link from "next/link";
import { Plus } from "lucide-react";
import { Suspense } from "react";
import type { ProjectStatus } from "@prisma/client";

import { archiveProject, duplicateProject } from "@/app/actions/projects";
import {
  ActionMenu,
  DataTable,
  EmptyState,
  PageHeader,
  Pagination,
  StatusBadge,
  TableToolbar,
  type DataTableColumn,
} from "@/components/admin";
import { Button } from "@/components/ui/button";
import { parseListParams } from "@/lib/admin/list-params";
import { requirePermission } from "@/lib/auth/session";
import { formatDate } from "@/lib/utils";
import { projectService } from "@/src/domain/project/service";

export const metadata = { title: "Projects" };

const PAGE_SIZE = 20;

type SearchParams = Promise<{
  q?: string;
  status?: string;
  published?: string;
  page?: string;
}>;

type ProjectRow = {
  id: string;
  slug: string;
  titleEn: string;
  status: ProjectStatus;
  featured: boolean;
  published: boolean;
  createdAt: Date;
  category: { nameEn: string } | null;
};

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requirePermission("projects:read");
  const sp = await searchParams;
  const { q, page, pageSize, filters } = parseListParams(sp, {
    pageSize: PAGE_SIZE,
    filterKeys: ["status", "published"],
  });

  const status = filters.status as ProjectStatus | undefined;
  const published =
    filters.published === "true"
      ? true
      : filters.published === "false"
        ? false
        : undefined;

  const { items: projects, total } = await projectService.list({
    q,
    page,
    pageSize,
    status,
    published,
  });

  const columns: DataTableColumn<ProjectRow>[] = [
    {
      id: "project",
      header: "Project",
      cell: (project) => (
        <>
          <Link
            href={`/admin/projects/${project.id}/edit`}
            className="font-medium hover:text-gold"
          >
            {project.titleEn}
          </Link>
          <p className="text-xs text-muted-foreground">{project.slug}</p>
        </>
      ),
    },
    {
      id: "category",
      header: "Category",
      className: "text-muted-foreground",
      cell: (project) => project.category?.nameEn ?? "—",
    },
    {
      id: "status",
      header: "Status",
      cell: (project) => <StatusBadge status={project.status} />,
    },
    {
      id: "featured",
      header: "Featured",
      cell: (project) => (
        <StatusBadge
          status={project.featured ? "PUBLISHED" : "DRAFT"}
          label={project.featured ? "Yes" : "No"}
        />
      ),
    },
    {
      id: "published",
      header: "Published",
      cell: (project) => (
        <StatusBadge status={project.published ? "PUBLISHED" : "DRAFT"} />
      ),
    },
    {
      id: "created",
      header: "Created",
      className: "text-muted-foreground",
      cell: (project) => formatDate(project.createdAt, "PP"),
    },
    {
      id: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (project) => (
        <ActionMenu
          viewHref={`/en/projects/${project.slug}`}
          editHref={`/admin/projects/${project.id}/edit`}
          onDuplicate={() => duplicateProject(project.id)}
          onArchive={() => archiveProject(project.id)}
          duplicateEditPath={(id) => `/admin/projects/${id}/edit`}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Manage construction projects and case studies."
        actions={
          <Button render={<Link href="/admin/projects/new" />}>
            <Plus data-icon="inline-start" />
            New project
          </Button>
        }
      />

      <Suspense fallback={null}>
        <TableToolbar
          placeholder="Search projects…"
          filters={[
            {
              name: "status",
              label: "Status",
              options: [
                { value: "PLANNED", label: "Planned" },
                { value: "IN_PROGRESS", label: "In progress" },
                { value: "COMPLETED", label: "Completed" },
                { value: "ON_HOLD", label: "On hold" },
              ],
            },
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

      <DataTable
        columns={columns}
        rows={projects}
        rowKey={(row) => row.id}
        empty={
          <EmptyState
            title="No projects found"
            description="Create a project or adjust your filters."
            action={
              <Button render={<Link href="/admin/projects/new" />}>
                New project
              </Button>
            }
          />
        }
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        basePath="/admin/projects"
        searchParams={{
          q: sp.q,
          status: sp.status,
          published: sp.published,
        }}
      />
    </div>
  );
}
