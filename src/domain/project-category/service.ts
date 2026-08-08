import { AuditAction } from "@/lib/audit/actions";
import { auditService } from "@/src/domain/audit/service";
import {
  projectCategoryRepository,
  type ProjectCategoryListParams,
} from "@/src/domain/project-category/repository";
import type {
  ProjectCategoryCreateInput,
  ProjectCategoryUpdateInput,
} from "@/src/domain/project-category/validation";
import type { DomainActor } from "@/src/domain/shared/actor";
import { DomainError, NotFoundError } from "@/src/domain/shared/errors";

export const projectCategoryService = {
  async list(params: ProjectCategoryListParams = {}) {
    return projectCategoryRepository.list(params);
  },

  async getById(id: string) {
    const category = await projectCategoryRepository.findById(id);
    if (!category || category.archivedAt) {
      throw new NotFoundError("Project category not found");
    }
    return category;
  },

  async listOptions() {
    return projectCategoryRepository.listOptions();
  },

  async create(actor: DomainActor, input: ProjectCategoryCreateInput) {
    try {
      const category = await projectCategoryRepository.create(input);

      await auditService.record(actor, {
        action: AuditAction.CREATE_PROJECT_CATEGORY,
        entity: "ProjectCategory",
        entityId: category.id,
        metadata: { slug: category.slug, nameEn: category.nameEn },
      });

      return category;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to create project category");
    }
  },

  async update(actor: DomainActor, input: ProjectCategoryUpdateInput) {
    const { id, ...data } = input;
    const existing = await projectCategoryRepository.findById(id);
    if (!existing || existing.archivedAt) {
      throw new NotFoundError("Project category not found");
    }

    try {
      const category = await projectCategoryRepository.update(id, data);

      await auditService.record(actor, {
        action: AuditAction.UPDATE_PROJECT_CATEGORY,
        entity: "ProjectCategory",
        entityId: category.id,
        metadata: { slug: category.slug, nameEn: category.nameEn },
      });

      return category;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to update project category");
    }
  },

  async archive(actor: DomainActor, id: string) {
    const existing = await projectCategoryRepository.findById(id);
    if (!existing || existing.archivedAt) {
      throw new NotFoundError("Project category not found");
    }

    try {
      const category = await projectCategoryRepository.archive(id);

      await auditService.record(actor, {
        action: AuditAction.ARCHIVE_PROJECT_CATEGORY,
        entity: "ProjectCategory",
        entityId: category.id,
        metadata: { slug: category.slug, nameEn: category.nameEn },
      });

      return category;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to archive project category");
    }
  },
};
