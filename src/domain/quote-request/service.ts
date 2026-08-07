import type { QuoteRequestStatus } from "@prisma/client";

import { AuditAction } from "@/lib/audit/actions";
import { auditService } from "@/src/domain/audit/service";
import { notificationService } from "@/src/domain/notification/service";
import { quoteRequestsToCsv } from "@/src/domain/quote-request/csv";
import {
  quoteRequestRepository,
  type QuoteRequestListParams,
} from "@/src/domain/quote-request/repository";
import {
  sanitizeMultiline,
  sanitizeText,
} from "@/src/domain/quote-request/sanitize";
import {
  quoteRequestSubmitSchema,
  quoteRequestUpdateNotesSchema,
  quoteRequestUpdateStatusSchema,
  type QuoteRequestSubmitInput,
} from "@/src/domain/quote-request/validation";
import type { DomainActor } from "@/src/domain/shared/actor";
import { DomainError, NotFoundError } from "@/src/domain/shared/errors";

function sanitizeSubmitInput(input: QuoteRequestSubmitInput) {
  return {
    company: sanitizeText(input.company, 200),
    name: sanitizeText(input.name, 160),
    email: sanitizeText(input.email, 200).toLowerCase(),
    phone: input.phone ? sanitizeText(input.phone, 60) : undefined,
    projectType: sanitizeText(input.projectType, 160),
    budget: input.budget ? sanitizeText(input.budget, 120) : undefined,
    location: input.location ? sanitizeText(input.location, 200) : undefined,
    timeline: input.timeline ? sanitizeText(input.timeline, 160) : undefined,
    message: sanitizeMultiline(input.message, 5000),
    attachmentUrl: input.attachmentUrl
      ? sanitizeText(input.attachmentUrl, 2000)
      : undefined,
  };
}

export const quoteRequestService = {
  async list(params: QuoteRequestListParams = {}) {
    return quoteRequestRepository.list(params);
  },

  async getById(id: string) {
    const request = await quoteRequestRepository.findById(id);
    if (!request) throw new NotFoundError("Quote request not found");
    return request;
  },

  async getDashboardStats() {
    const [byStatus, total] = await Promise.all([
      quoteRequestRepository.countByStatus(),
      quoteRequestRepository.countAll(),
    ]);

    const open =
      byStatus.NEW + byStatus.IN_REVIEW + byStatus.CONTACTED;

    return {
      total,
      open,
      byStatus,
    };
  },

  /**
   * Public submission — validates, sanitizes, persists, audits, notifies (noop).
   * Spam: honeypot `website` must be empty (checked here after Zod).
   */
  async submit(input: QuoteRequestSubmitInput) {
    const parsed = quoteRequestSubmitSchema.safeParse(input);
    if (!parsed.success) {
      throw new DomainError("Validation failed");
    }

    if (parsed.data.website) {
      // Honeypot tripped — pretend success without persisting.
      return { id: "suppressed", suppressed: true as const };
    }

    const clean = sanitizeSubmitInput(parsed.data);

    try {
      const created = await quoteRequestRepository.create(clean);

      await auditService.record(null, {
        action: AuditAction.CREATE_QUOTE_REQUEST,
        entity: "QuoteRequest",
        entityId: created.id,
        metadata: {
          source: "public",
          email: created.email,
          company: created.company,
        },
      });

      await notificationService.notifyQuoteRequestReceived({
        id: created.id,
        company: created.company,
        name: created.name,
        email: created.email,
        phone: created.phone,
        projectType: created.projectType,
        budget: created.budget,
        location: created.location,
        timeline: created.timeline,
        message: created.message,
        createdAt: created.createdAt,
      });

      return { id: created.id, suppressed: false as const };
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to submit quote request");
    }
  },

  async updateStatus(
    actor: DomainActor,
    input: { id: string; status: QuoteRequestStatus },
  ) {
    const parsed = quoteRequestUpdateStatusSchema.safeParse(input);
    if (!parsed.success) throw new DomainError("Validation failed");

    const existing = await quoteRequestRepository.findById(parsed.data.id);
    if (!existing) throw new NotFoundError("Quote request not found");

    try {
      const updated = await quoteRequestRepository.updateStatus(
        parsed.data.id,
        parsed.data.status,
      );

      const action =
        parsed.data.status === "ARCHIVED"
          ? AuditAction.ARCHIVE_QUOTE_REQUEST
          : AuditAction.UPDATE_QUOTE_REQUEST_STATUS;

      await auditService.record(actor, {
        action,
        entity: "QuoteRequest",
        entityId: updated.id,
        metadata: {
          from: existing.status,
          to: updated.status,
        },
      });

      return updated;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to update quote request status");
    }
  },

  async updateNotes(
    actor: DomainActor,
    input: { id: string; notes?: string },
  ) {
    const parsed = quoteRequestUpdateNotesSchema.safeParse(input);
    if (!parsed.success) throw new DomainError("Validation failed");

    const existing = await quoteRequestRepository.findById(parsed.data.id);
    if (!existing) throw new NotFoundError("Quote request not found");

    const notes = parsed.data.notes
      ? sanitizeMultiline(parsed.data.notes, 10000)
      : null;

    try {
      const updated = await quoteRequestRepository.updateNotes(
        parsed.data.id,
        notes,
      );

      await auditService.record(actor, {
        action: AuditAction.UPDATE_QUOTE_REQUEST_NOTES,
        entity: "QuoteRequest",
        entityId: updated.id,
      });

      return updated;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to update quote request notes");
    }
  },

  async archive(actor: DomainActor, id: string) {
    return this.updateStatus(actor, { id, status: "ARCHIVED" });
  },

  async delete(actor: DomainActor, id: string) {
    const existing = await quoteRequestRepository.findById(id);
    if (!existing) throw new NotFoundError("Quote request not found");

    try {
      await quoteRequestRepository.delete(id);

      await auditService.record(actor, {
        action: AuditAction.DELETE_QUOTE_REQUEST,
        entity: "QuoteRequest",
        entityId: id,
      });

      return { id };
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to delete quote request");
    }
  },

  async exportCsv(
    params: Omit<QuoteRequestListParams, "page" | "pageSize"> = {},
  ) {
    const rows = await quoteRequestRepository.listForExport(params);
    return {
      csv: quoteRequestsToCsv(rows),
      count: rows.length,
      filename: `quote-requests-${new Date().toISOString().slice(0, 10)}.csv`,
    };
  },
};
