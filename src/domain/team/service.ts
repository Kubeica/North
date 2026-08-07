import { AuditAction } from "@/lib/audit/actions";
import { auditService } from "@/src/domain/audit/service";
import type { DomainActor } from "@/src/domain/shared/actor";
import { DomainError, NotFoundError } from "@/src/domain/shared/errors";
import {
  teamRepository,
  type TeamListParams,
} from "@/src/domain/team/repository";
import type {
  TeamMemberCreateInput,
  TeamMemberUpdateInput,
} from "@/src/domain/team/validation";

export const teamService = {
  async list(params: TeamListParams = {}) {
    return teamRepository.list(params);
  },

  async listPublished() {
    return teamRepository.listPublished();
  },

  async getById(id: string) {
    const member = await teamRepository.findById(id);
    if (!member || member.archivedAt) {
      throw new NotFoundError("Team member not found");
    }
    return member;
  },

  async create(actor: DomainActor, input: TeamMemberCreateInput) {
    try {
      const member = await teamRepository.create(input);

      await auditService.record(actor, {
        action: AuditAction.CREATE_TEAM_MEMBER,
        entity: "TeamMember",
        entityId: member.id,
        metadata: { nameEn: member.nameEn },
      });

      return member;
    } catch {
      throw new DomainError("Failed to create team member");
    }
  },

  async update(actor: DomainActor, input: TeamMemberUpdateInput) {
    const { id, ...data } = input;
    const existing = await teamRepository.findById(id);
    if (!existing || existing.archivedAt) {
      throw new NotFoundError("Team member not found");
    }

    try {
      const member = await teamRepository.update(id, data);

      await auditService.record(actor, {
        action: AuditAction.UPDATE_TEAM_MEMBER,
        entity: "TeamMember",
        entityId: member.id,
        metadata: { nameEn: member.nameEn },
      });

      return member;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to update team member");
    }
  },

  async archive(actor: DomainActor, id: string) {
    const existing = await teamRepository.findById(id);
    if (!existing || existing.archivedAt) {
      throw new NotFoundError("Team member not found");
    }

    try {
      const member = await teamRepository.archive(id);

      await auditService.record(actor, {
        action: AuditAction.ARCHIVE_TEAM_MEMBER,
        entity: "TeamMember",
        entityId: member.id,
        metadata: { nameEn: member.nameEn },
      });

      return member;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to archive team member");
    }
  },
};
