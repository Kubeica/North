import { AuditAction } from "@/lib/audit/actions";
import { auditService } from "@/src/domain/audit/service";
import type { DomainActor } from "@/src/domain/shared/actor";
import { DomainError, NotFoundError } from "@/src/domain/shared/errors";
import {
  statisticRepository,
  type StatisticListParams,
} from "@/src/domain/statistic/repository";
import type {
  StatisticCreateInput,
  StatisticUpdateInput,
} from "@/src/domain/statistic/validation";

export const statisticService = {
  async list(params: StatisticListParams = {}) {
    return statisticRepository.list(params);
  },

  async getById(id: string) {
    const statistic = await statisticRepository.findById(id);
    if (!statistic || statistic.archivedAt) {
      throw new NotFoundError("Statistic not found");
    }
    return statistic;
  },

  async listPublished() {
    return statisticRepository.listPublished();
  },

  async create(actor: DomainActor, input: StatisticCreateInput) {
    try {
      const statistic = await statisticRepository.create(input);

      await auditService.record(actor, {
        action: AuditAction.CREATE_STATISTIC,
        entity: "Statistic",
        entityId: statistic.id,
        metadata: {
          labelEn: statistic.labelEn,
          value: statistic.value,
          published: statistic.published,
        },
      });

      if (statistic.published) {
        await auditService.record(actor, {
          action: AuditAction.PUBLISH_STATISTIC,
          entity: "Statistic",
          entityId: statistic.id,
        });
      }

      return statistic;
    } catch {
      throw new DomainError("Failed to create statistic");
    }
  },

  async update(actor: DomainActor, input: StatisticUpdateInput) {
    const { id, ...data } = input;
    const existing = await statisticRepository.findById(id);
    if (!existing || existing.archivedAt) {
      throw new NotFoundError("Statistic not found");
    }

    try {
      const statistic = await statisticRepository.update(id, data);

      await auditService.record(actor, {
        action: AuditAction.UPDATE_STATISTIC,
        entity: "Statistic",
        entityId: statistic.id,
        metadata: {
          labelEn: statistic.labelEn,
          value: statistic.value,
          published: statistic.published,
        },
      });

      if (
        data.published !== undefined &&
        data.published !== existing.published
      ) {
        await auditService.record(actor, {
          action: data.published
            ? AuditAction.PUBLISH_STATISTIC
            : AuditAction.UNPUBLISH_STATISTIC,
          entity: "Statistic",
          entityId: statistic.id,
        });
      }

      return statistic;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to update statistic");
    }
  },

  async archive(actor: DomainActor, id: string) {
    const existing = await statisticRepository.findById(id);
    if (!existing || existing.archivedAt) {
      throw new NotFoundError("Statistic not found");
    }

    try {
      const statistic = await statisticRepository.archive(id);

      await auditService.record(actor, {
        action: AuditAction.ARCHIVE_STATISTIC,
        entity: "Statistic",
        entityId: statistic.id,
        metadata: { labelEn: statistic.labelEn },
      });

      return statistic;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to archive statistic");
    }
  },
};
