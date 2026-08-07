import { auditService } from "@/src/domain/audit/service";

export type AuditLogInput = {
  userId?: string | null;
  action: string;
  entity?: string | null;
  entityId?: string | null;
  metadata?: Record<string, unknown> | null;
};

/**
 * Thin backwards-compatible wrapper around `auditService.record`.
 * Prefer calling `auditService.record` from domain services and auth events.
 */
export async function createAuditLog(input: AuditLogInput) {
  return auditService.record(
    input.userId ? { userId: input.userId } : null,
    {
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      metadata: input.metadata,
    },
  );
}
