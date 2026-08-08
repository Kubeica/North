import Link from "next/link";
import {
  Building2,
  FolderKanban,
  Mail,
  Plus,
  ScrollText,
  Settings,
  Users,
  Wrench,
} from "lucide-react";

import {
  AuditPanel,
  DashboardCard,
  EmptyState,
  PageHeader,
  StatCard,
  StatusBadge,
} from "@/components/admin";
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
import { dashboardService } from "@/src/domain/dashboard/service";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const user = await requireSession();
  const isAdmin = can(user.role, "users:read");
  const canReadAudit = can(user.role, "audit:read");

  const {
    totalProjects,
    completedProjects,
    activeProjects,
    servicesCount,
    clientsCount,
    unreadMessages,
    usersCount,
    recentProjects,
    recentMessages,
    recentAudit,
  } = await dashboardService.getAdminOverview(
    { userId: user.id },
    { includeUsers: isAdmin, includeAudit: canReadAudit },
  );

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${user.name}. Northern Meteor CMS overview.`}
        actions={
          <Button render={<Link href="/admin/projects/new" />}>
            <Plus data-icon="inline-start" />
            New project
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard
          label="Projects"
          value={totalProjects}
          href="/admin/projects"
          icon={<FolderKanban />}
          hint={`${activeProjects} active · ${completedProjects} completed`}
        />
        <StatCard
          label="Services"
          value={servicesCount}
          href="/admin/services"
          icon={<Wrench />}
        />
        <StatCard
          label="Clients"
          value={clientsCount}
          href="/admin/clients"
          icon={<Building2 />}
        />
        <StatCard
          label="Messages"
          value={unreadMessages}
          href="/admin/messages?status=UNREAD"
          icon={<Mail />}
          hint="Unread inbox"
        />
        {isAdmin ? (
          <StatCard
            label="Users"
            value={usersCount}
            href="/admin/users"
            icon={<Users />}
            hint="Active accounts"
          />
        ) : (
          <StatCard
            label="Active projects"
            value={activeProjects}
            href="/admin/projects?status=IN_PROGRESS"
            icon={<FolderKanban />}
          />
        )}
        <StatCard
          label="Completed"
          value={completedProjects}
          href="/admin/projects?status=COMPLETED"
          icon={<FolderKanban />}
        />
      </div>

      <DashboardCard
        title="Quick actions"
        className="mt-6"
        description="Common CMS tasks"
      >
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            render={<Link href="/admin/projects/new" />}
          >
            <Plus data-icon="inline-start" />
            Project
          </Button>
          <Button
            size="sm"
            variant="outline"
            render={<Link href="/admin/services/new" />}
          >
            <Plus data-icon="inline-start" />
            Service
          </Button>
          <Button
            size="sm"
            variant="outline"
            render={<Link href="/admin/clients/new" />}
          >
            <Plus data-icon="inline-start" />
            Client
          </Button>
          <Button
            size="sm"
            variant="outline"
            render={<Link href="/admin/messages" />}
          >
            <Mail data-icon="inline-start" />
            Inbox
          </Button>
          {isAdmin ? (
            <>
              <Button
                size="sm"
                variant="outline"
                render={<Link href="/admin/settings" />}
              >
                <Settings data-icon="inline-start" />
                Settings
              </Button>
              <Button
                size="sm"
                variant="outline"
                render={<Link href="/admin/audit-logs" />}
              >
                <ScrollText data-icon="inline-start" />
                Audit logs
              </Button>
            </>
          ) : null}
        </div>
      </DashboardCard>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <DashboardCard
          title="Recent projects"
          action={{ href: "/admin/projects", label: "View all" }}
        >
          {recentProjects.length === 0 ? (
            <EmptyState title="No projects yet" className="py-10" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="font-medium text-foreground hover:text-gold"
                      >
                        {project.titleEn}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {project.category?.nameEn ?? "Uncategorized"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={project.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(project.createdAt, "PP")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DashboardCard>

        <DashboardCard
          title="Recent messages"
          action={{ href: "/admin/messages", label: "Inbox" }}
        >
          {recentMessages.length === 0 ? (
            <EmptyState title="No messages" className="py-10" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Received</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentMessages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>
                      <p className="font-medium">{message.name}</p>
                      <p className="max-w-[220px] truncate text-xs text-muted-foreground">
                        {message.subject}
                      </p>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={message.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(message.createdAt, "PP")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DashboardCard>
      </div>

      {canReadAudit ? (
        <DashboardCard
          title="Recent activity"
          className="mt-6"
          action={{ href: "/admin/audit-logs", label: "Full audit log" }}
        >
          <AuditPanel
            bare
            title=""
            entries={recentAudit.map((log) => ({
              id: log.id,
              action: log.action,
              entity: log.entity,
              userName: log.user?.name ?? "System",
              createdAt: log.createdAt.toISOString(),
            }))}
          />
        </DashboardCard>
      ) : null}
    </div>
  );
}
