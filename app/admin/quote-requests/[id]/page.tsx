import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/admin/PageHeader";
import { QuoteRequestDetailActions } from "@/components/admin/QuoteRequestDetailActions";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { requirePermission } from "@/lib/auth/session";
import { formatDate } from "@/lib/utils";
import { NotFoundError } from "@/src/domain/shared/errors";
import { quoteRequestService } from "@/src/domain/quote-request/service";
import type { QuoteRequestStatus } from "@/types";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  return { title: `Quote Request · ${id.slice(0, 8)}` };
}

export default async function AdminQuoteRequestDetailPage({
  params,
}: PageProps) {
  await requirePermission("quotes:read");
  const { id } = await params;

  let request;
  try {
    request = await quoteRequestService.getById(id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  const fields: { label: string; value: string | null | undefined }[] = [
    { label: "Company", value: request.company },
    { label: "Name", value: request.name },
    { label: "Email", value: request.email },
    { label: "Phone", value: request.phone },
    { label: "Project type", value: request.projectType },
    { label: "Budget", value: request.budget },
    { label: "Location", value: request.location },
    { label: "Timeline", value: request.timeline },
    { label: "Attachment", value: request.attachmentUrl ?? "— (not uploaded)" },
  ];

  return (
    <div>
      <PageHeader
        title={request.company}
        description={`Submitted ${formatDate(request.createdAt, "PPp")}`}
        actions={<StatusBadge status={request.status} />}
      >
        <Link
          href="/admin/quote-requests"
          className="text-sm text-gold hover:underline"
        >
          Back to list
        </Link>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <dl className="grid gap-4 rounded-xl border border-border bg-surface/40 p-5 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.label}>
                <dt className="text-xs text-muted-foreground">{field.label}</dt>
                <dd className="mt-1 text-sm text-foreground">
                  {field.value || "—"}
                </dd>
              </div>
            ))}
          </dl>

          <div className="rounded-xl border border-border bg-surface/40 p-5">
            <h2 className="text-sm font-medium text-muted-foreground">
              Message
            </h2>
            <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/90">
              {request.message}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface/40 p-5 lg:col-span-5">
          <QuoteRequestDetailActions
            id={request.id}
            status={request.status as QuoteRequestStatus}
            notes={request.notes}
          />
        </div>
      </div>
    </div>
  );
}
