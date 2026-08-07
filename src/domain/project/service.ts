import { AuditAction } from "@/lib/audit/actions";
import { auditService } from "@/src/domain/audit/service";
import {
  projectRepository,
  type ProjectListParams,
  type ProjectPublicFilters,
} from "@/src/domain/project/repository";
import type {
  ProjectCreateInput,
  ProjectUpdateInput,
} from "@/src/domain/project/validation";
import type { DomainActor } from "@/src/domain/shared/actor";
import {
  DomainError,
  NotFoundError,
} from "@/src/domain/shared/errors";
import { runTransaction } from "@/src/domain/shared/transaction";

export type ProjectCreateCommand = ProjectCreateInput & {
  galleryUrls?: string[];
};

export type ProjectUpdateCommand = ProjectUpdateInput & {
  galleryUrls?: string[];
};

async function allocateCopySlug(sourceSlug: string): Promise<string> {
  const baseSlug = `${sourceSlug}-copy`;
  let slug = baseSlug;
  let n = 1;
  while (await projectRepository.findUniqueSlug(slug)) {
    n += 1;
    slug = `${baseSlug}-${n}`;
  }
  return slug;
}

export const projectService = {
  async list(params: ProjectListParams = {}) {
    return projectRepository.list(params);
  },

  async getById(id: string) {
    const project = await projectRepository.findById(id);
    if (!project || project.archivedAt) {
      throw new NotFoundError("Project not found");
    }
    return project;
  },

  async listCategories() {
    return projectRepository.listCategories();
  },

  async listPublished(filters: ProjectPublicFilters = {}) {
    return projectRepository.listPublished(filters);
  },

  async listFeatured(limit = 6) {
    return projectRepository.listFeatured(limit);
  },

  async getPublishedBySlug(slug: string) {
    return projectRepository.findPublishedBySlug(slug);
  },

  async listRelated(
    projectId: string,
    categoryId: string | null | undefined,
    limit = 3,
  ) {
    return projectRepository.listRelated(projectId, categoryId, limit);
  },

  async listPublishedCategories() {
    return projectRepository.listPublishedCategories();
  },

  async listPublishedLocations() {
    return projectRepository.listPublishedLocations();
  },

  async listForSitemap() {
    return projectRepository.listForSitemap();
  },

  async create(actor: DomainActor, input: ProjectCreateCommand) {
    const { galleryUrls = [], ...projectInput } = input;

    try {
      const project = await runTransaction(async (tx) => {
        const created = await projectRepository.create(projectInput, tx);
        await projectRepository.replaceGallery(created.id, galleryUrls, tx);
        return created;
      });

      await auditService.record(actor, {
        action: AuditAction.CREATE_PROJECT,
        entity: "Project",
        entityId: project.id,
        metadata: { slug: project.slug },
      });

      return project;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to create project");
    }
  },

  async update(actor: DomainActor, input: ProjectUpdateCommand) {
    const { id, galleryUrls, ...data } = input;

    const existing = await projectRepository.findById(id);
    if (!existing || existing.archivedAt) {
      throw new NotFoundError("Project not found");
    }

    try {
      const project = await runTransaction(async (tx) => {
        const updated = await projectRepository.update(id, data, tx);
        if (galleryUrls !== undefined) {
          await projectRepository.replaceGallery(id, galleryUrls, tx);
        }
        return updated;
      });

      await auditService.record(actor, {
        action: AuditAction.UPDATE_PROJECT,
        entity: "Project",
        entityId: project.id,
        metadata: { slug: project.slug },
      });

      return project;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to update project");
    }
  },

  async archive(actor: DomainActor, id: string) {
    const existing = await projectRepository.findById(id);
    if (!existing || existing.archivedAt) {
      throw new NotFoundError("Project not found");
    }

    try {
      const project = await projectRepository.archive(id);

      await auditService.record(actor, {
        action: AuditAction.ARCHIVE_PROJECT,
        entity: "Project",
        entityId: project.id,
        metadata: { slug: project.slug },
      });

      return project;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to archive project");
    }
  },

  async duplicate(actor: DomainActor, id: string) {
    const source = await projectRepository.findById(id);
    if (!source || source.archivedAt) {
      throw new NotFoundError("Project not found");
    }

    try {
      const slug = await allocateCopySlug(source.slug);

      const project = await runTransaction(async (tx) => {
        return projectRepository.createWithImages(
          {
            slug,
            titleAr: `${source.titleAr} (نسخة)`,
            titleEn: `${source.titleEn} (Copy)`,
            summaryAr: source.summaryAr ?? undefined,
            summaryEn: source.summaryEn ?? undefined,
            descriptionAr: source.descriptionAr,
            descriptionEn: source.descriptionEn,
            locationAr: source.locationAr ?? undefined,
            locationEn: source.locationEn ?? undefined,
            coverImageUrl: source.coverImageUrl ?? undefined,
            clientId: source.clientId ?? undefined,
            categoryId: source.categoryId ?? undefined,
            status: source.status,
            startDate: source.startDate,
            completionDate: source.completionDate,
            featured: false,
            published: false,
            seoTitleAr: source.seoTitleAr ?? undefined,
            seoTitleEn: source.seoTitleEn ?? undefined,
            seoDescriptionAr: source.seoDescriptionAr ?? undefined,
            seoDescriptionEn: source.seoDescriptionEn ?? undefined,
            scopeAr: source.scopeAr ?? undefined,
            scopeEn: source.scopeEn ?? undefined,
            isDemo: source.isDemo,
            images: source.images.map((img) => ({
              url: img.url,
              altAr: img.altAr,
              altEn: img.altEn,
              sortOrder: img.sortOrder,
            })),
          },
          tx,
        );
      });

      await auditService.record(actor, {
        action: AuditAction.DUPLICATE_PROJECT,
        entity: "Project",
        entityId: project.id,
        metadata: { sourceId: source.id, slug: project.slug },
      });

      return project;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to duplicate project");
    }
  },
};
