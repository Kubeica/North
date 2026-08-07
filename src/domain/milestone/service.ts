import { AuditAction } from "@/lib/audit/actions";
import { auditService } from "@/src/domain/audit/service";
import type { DomainActor } from "@/src/domain/shared/actor";
import { DomainError, NotFoundError } from "@/src/domain/shared/errors";
import {
  milestoneRepository,
  type MilestoneListParams,
} from "@/src/domain/milestone/repository";
import type {
  CompanyMilestoneCreateInput,
  CompanyMilestoneUpdateInput,
} from "@/src/domain/milestone/validation";

export const milestoneService = {
  async list(params: MilestoneListParams = {}) {
    return milestoneRepository.list(params);
  },

  async listPublished() {
    return milestoneRepository.listPublished();
  },

  async getById(id: string) {
    const milestone = await milestoneRepository.findById(id);
    if (!milestone) {
      throw new NotFoundError("Company milestone not found");
    }
    return milestone;
  },

  async create(actor: DomainActor, input: CompanyMilestoneCreateInput) {
    try {
      const milestone = await milestoneRepository.create(input);

      await auditService.record(actor, {
        action: AuditAction.CREATE_COMPANY_MILESTONE,
        entity: "CompanyMilestone",
        entityId: milestone.id,
        metadata: { titleEn: milestone.titleEn, year: milestone.year },
      });

      return milestone;
    } catch {
      throw new DomainError("Failed to create company milestone");
    }
  },

  async update(actor: DomainActor, input: CompanyMilestoneUpdateInput) {
    const { id, ...data } = input;
    const existing = await milestoneRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Company milestone not found");
    }

    try {
      const milestone = await milestoneRepository.update(id, data);

      await auditService.record(actor, {
        action: AuditAction.UPDATE_COMPANY_MILESTONE,
        entity: "CompanyMilestone",
        entityId: milestone.id,
        metadata: { titleEn: milestone.titleEn, year: milestone.year },
      });

      return milestone;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to update company milestone");
    }
  },

  async delete(actor: DomainActor, id: string) {
    const existing = await milestoneRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Company milestone not found");
    }

    try {
      const milestone = await milestoneRepository.delete(id);

      await auditService.record(actor, {
        action: AuditAction.DELETE_COMPANY_MILESTONE,
        entity: "CompanyMilestone",
        entityId: milestone.id,
        metadata: { titleEn: existing.titleEn, year: existing.year },
      });

      return milestone;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to delete company milestone");
    }
  },
};
