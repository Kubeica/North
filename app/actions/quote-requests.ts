"use server";

import { revalidatePath } from "next/cache";

import { actionOk, type ActionResult } from "@/lib/admin/action";
import { mapDomainError } from "@/lib/admin/map-domain-error";
import { AuditAction } from "@/lib/audit/actions";
import { requirePermission } from "@/lib/auth/session";
import { getClientIp } from "@/lib/security/client-ip";
import { quoteRateLimitConfig } from "@/lib/security/env-limits";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { auditService } from "@/src/domain/audit/service";
import { getQuoteAttachmentProvider } from "@/src/domain/quote-request/attachment";
import { quoteRequestService } from "@/src/domain/quote-request/service";
import { quoteRequestSubmitSchema } from "@/src/domain/quote-request/validation";
import type { QuoteRequestActionState, QuoteRequestStatus } from "@/types";

export async function submitQuoteRequest(
  _prev: QuoteRequestActionState,
  formData: FormData,
): Promise<QuoteRequestActionState> {
  const raw = {
    company: String(formData.get("company") ?? ""),
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    projectType: String(formData.get("projectType") ?? ""),
    budget: String(formData.get("budget") ?? ""),
    location: String(formData.get("location") ?? ""),
    timeline: String(formData.get("timeline") ?? ""),
    message: String(formData.get("message") ?? ""),
    website: String(formData.get("website") ?? ""),
    attachmentUrl: "",
  };

  const parsed = quoteRequestSubmitSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: NonNullable<QuoteRequestActionState["fieldErrors"]> = {};
    const allowed = new Set([
      "company",
      "name",
      "email",
      "phone",
      "projectType",
      "budget",
      "location",
      "timeline",
      "message",
      "attachment",
    ] as const);
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (
        typeof key === "string" &&
        allowed.has(key as keyof typeof fieldErrors) &&
        !(key in fieldErrors)
      ) {
        fieldErrors[key as keyof typeof fieldErrors] = issue.message;
      }
    }
    return { ok: false, error: "validation", fieldErrors };
  }

  try {
    const { max, windowMs } = quoteRateLimitConfig();
    const ip = await getClientIp();
    const rate = await checkRateLimit(`quote:${ip}`, max, windowMs);
    if (!rate.success) {
      return { ok: false, error: "rateLimited" };
    }

    // Attachment architecture — stub provider does not persist files yet.
    const file = formData.get("attachment");
    if (file instanceof File && file.size > 0) {
      const provider = getQuoteAttachmentProvider();
      await provider.store({
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
        size: file.size,
      });
      // attachmentUrl remains unset until a real provider is wired.
    }

    await quoteRequestService.submit(parsed.data);

    return { ok: true };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[quote-request] submit failed:", error);
    }
    return { ok: false, error: "server" };
  }
}

export async function updateQuoteRequestStatus(
  id: string,
  status: QuoteRequestStatus,
): Promise<ActionResult<{ id: string }>> {
  const user = await requirePermission("quotes:write");

  try {
    const request = await quoteRequestService.updateStatus(
      { userId: user.id },
      { id, status },
    );
    revalidatePath("/admin/quote-requests");
    revalidatePath(`/admin/quote-requests/${id}`);
    revalidatePath("/admin/dashboard");
    return actionOk({ id: request.id }, "Status updated");
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function updateQuoteRequestNotes(
  id: string,
  notes: string,
): Promise<ActionResult<{ id: string }>> {
  const user = await requirePermission("quotes:write");

  try {
    const request = await quoteRequestService.updateNotes(
      { userId: user.id },
      { id, notes },
    );
    revalidatePath("/admin/quote-requests");
    revalidatePath(`/admin/quote-requests/${id}`);
    return actionOk({ id: request.id }, "Notes saved");
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function archiveQuoteRequest(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  const user = await requirePermission("quotes:write");

  try {
    const request = await quoteRequestService.archive({ userId: user.id }, id);
    revalidatePath("/admin/quote-requests");
    revalidatePath(`/admin/quote-requests/${id}`);
    revalidatePath("/admin/dashboard");
    return actionOk({ id: request.id }, "Quote request archived");
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function deleteQuoteRequest(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  const user = await requirePermission("quotes:write");

  try {
    const result = await quoteRequestService.delete({ userId: user.id }, id);
    revalidatePath("/admin/quote-requests");
    revalidatePath("/admin/dashboard");
    return actionOk(result, "Quote request deleted");
  } catch (error) {
    return mapDomainError(error);
  }
}

/** CSV export architecture — returns CSV payload for client download. */
export async function exportQuoteRequestsCsv(input?: {
  q?: string;
  status?: string;
}): Promise<ActionResult<{ csv: string; filename: string; count: number }>> {
  const user = await requirePermission("quotes:read");

  try {
    const result = await quoteRequestService.exportCsv({
      q: input?.q,
      status: input?.status,
    });

    await auditService.record(
      { userId: user.id },
      {
        action: AuditAction.EXPORT_QUOTE_REQUESTS,
        entity: "QuoteRequest",
        metadata: {
          count: result.count,
          q: input?.q ?? null,
          status: input?.status ?? null,
        },
      },
    );

    return actionOk(result, `Exported ${result.count} rows`);
  } catch (error) {
    return mapDomainError(error);
  }
}
