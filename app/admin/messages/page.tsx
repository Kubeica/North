import { Suspense } from "react";
import type { MessageStatus } from "@prisma/client";

import { EmptyState } from "@/components/admin/EmptyState";
import { MessageActions } from "@/components/admin/MessageActions";
import { PageHeader } from "@/components/admin/PageHeader";
import { Pagination } from "@/components/admin/Pagination";
import { SearchFilters } from "@/components/admin/SearchFilters";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { requirePermission } from "@/lib/auth/session";
import { formatDate } from "@/lib/utils";
import { messageService } from "@/src/domain/message/service";

export const metadata = { title: "Messages" };

const PAGE_SIZE = 20;

type SearchParams = Promise<{
  q?: string;
  status?: string;
  page?: string;
}>;

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requirePermission("messages:read");
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const q = sp.q?.trim() ?? "";
  const status = (sp.status as MessageStatus | undefined) || undefined;

  const { items: messages, total } = await messageService.list({
    q,
    status,
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <div>
      <PageHeader
        title="Messages"
        description="Contact form inbox — unread, read, and archived."
      />

      <Suspense fallback={null}>
        <SearchFilters
          placeholder="Search messages…"
          filters={[
            {
              name: "status",
              label: "Status",
              options: [
                { value: "UNREAD", label: "Unread" },
                { value: "READ", label: "Read" },
                { value: "ARCHIVED", label: "Archived" },
              ],
            },
          ]}
        />
      </Suspense>

      {messages.length === 0 ? (
        <EmptyState
          title="Inbox is empty"
          description="New contact form submissions will appear here."
        />
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <article
              key={message.id}
              className="rounded-xl border border-border bg-surface/40 p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-medium text-foreground">
                      {message.subject}
                    </h2>
                    <StatusBadge status={message.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {message.name} · {message.email}
                    {message.company ? ` · ${message.company}` : ""}
                    {message.phone ? ` · ${message.phone}` : ""}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/90">
                    {message.message}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatDate(message.createdAt, "PPp")}
                  </p>
                </div>
                <MessageActions id={message.id} status={message.status} />
              </div>
            </article>
          ))}
        </div>
      )}

      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        basePath="/admin/messages"
        searchParams={{ q: sp.q, status: sp.status }}
      />
    </div>
  );
}
