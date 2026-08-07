import { AuditAction } from "@/lib/audit/actions";
import { auditService } from "@/src/domain/audit/service";
import {
  serviceRepository,
  type ServiceListParams,
} from "@/src/domain/service/repository";
import type {
  ServiceCreateInput,
  ServiceUpdateInput,
} from "@/src/domain/service/validation";
import type { DomainActor } from "@/src/domain/shared/actor";
import {
  DomainError,
  NotFoundError,
} from "@/src/domain/shared/errors";

export const cmsServiceService = {
  async list(params: ServiceListParams = {}) {
    return serviceRepository.list(params);
  },

  async getById(id: string) {
    const service = await serviceRepository.findById(id);
    if (!service || service.archivedAt) {
      throw new NotFoundError("Service not found");
    }
    return service;
  },

  async listPublished() {
    return serviceRepository.listPublished();
  },

  async getBySlug(slug: string) {
    return serviceRepository.findPublishedBySlug(slug);
  },

  async listForSitemap() {
    return serviceRepository.listForSitemap();
  },

  async create(actor: DomainActor, input: ServiceCreateInput) {
    try {
      const service = await serviceRepository.create(input);

      await auditService.record(actor, {
        action: AuditAction.CREATE_SERVICE,
        entity: "Service",
        entityId: service.id,
        metadata: { slug: service.slug },
      });

      return service;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to create service");
    }
  },

  async update(actor: DomainActor, input: ServiceUpdateInput) {
    const { id, ...data } = input;
    const existing = await serviceRepository.findById(id);
    if (!existing || existing.archivedAt) {
      throw new NotFoundError("Service not found");
    }

    try {
      const service = await serviceRepository.update(id, data);

      await auditService.record(actor, {
        action: AuditAction.UPDATE_SERVICE,
        entity: "Service",
        entityId: service.id,
        metadata: { slug: service.slug },
      });

      return service;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to update service");
    }
  },

  async archive(actor: DomainActor, id: string) {
    const existing = await serviceRepository.findById(id);
    if (!existing || existing.archivedAt) {
      throw new NotFoundError("Service not found");
    }

    try {
      const service = await serviceRepository.archive(id);

      await auditService.record(actor, {
        action: AuditAction.ARCHIVE_SERVICE,
        entity: "Service",
        entityId: service.id,
        metadata: { slug: service.slug },
      });

      return service;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to archive service");
    }
  },
};

/** Alias matching the CMS entity name "service". */
export const serviceService = cmsServiceService;
