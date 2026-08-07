import { AuditAction } from "@/lib/audit/actions";
import { getStorageProvider } from "@/lib/storage";
import { auditService } from "@/src/domain/audit/service";
import {
  mediaRepository,
  type MediaListParams,
} from "@/src/domain/media/repository";
import {
  extensionForMediaMime,
  isAllowedMediaMime,
  isAllowedMediaSize,
  mediaMaxBytesLimit,
} from "@/src/domain/media/validation";
import type { DomainActor } from "@/src/domain/shared/actor";
import { DomainError, NotFoundError } from "@/src/domain/shared/errors";

function keyFromUrl(url: string): string | null {
  const marker = "/uploads/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

export type CreateFromUploadInput = {
  actor: DomainActor;
  file: File;
  altAr?: string | null;
  altEn?: string | null;
};

export const mediaService = {
  async list(params: MediaListParams = {}) {
    return mediaRepository.list(params);
  },

  async archive(actor: DomainActor, id: string) {
    const existing = await mediaRepository.findById(id);
    if (!existing || existing.archivedAt) {
      throw new NotFoundError("Media not found");
    }

    try {
      const media = await mediaRepository.archive(id);

      await auditService.record(actor, {
        action: AuditAction.ARCHIVE_MEDIA,
        entity: "Media",
        entityId: media.id,
        metadata: { fileName: media.fileName },
      });

      return media;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to archive media");
    }
  },

  async delete(actor: DomainActor, id: string) {
    const media = await mediaRepository.findById(id);
    if (!media) {
      throw new NotFoundError("Media not found");
    }

    try {
      const key = keyFromUrl(media.url);
      if (key) {
        try {
          await getStorageProvider().delete(key);
        } catch {
          // Continue deleting DB record even if file is already gone.
        }
      }

      await mediaRepository.delete(id);

      await auditService.record(actor, {
        action: AuditAction.DELETE_MEDIA,
        entity: "Media",
        entityId: id,
        metadata: { fileName: media.fileName, url: media.url },
      });

      return { id };
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to delete media");
    }
  },

  async createFromUpload({
    actor,
    file,
    altAr,
    altEn,
  }: CreateFromUploadInput) {
    if (!isAllowedMediaMime(file.type)) {
      throw new DomainError(
        "Unsupported file type. Allowed: JPEG, PNG, WebP, GIF, PDF.",
      );
    }
    if (!isAllowedMediaSize(file.size)) {
      throw new DomainError(
        `File must be between 1 byte and ${Math.floor(mediaMaxBytesLimit() / (1024 * 1024))} MB`,
      );
    }

    const safeExt = extensionForMediaMime(file.type);
    if (!safeExt) {
      throw new DomainError("Unsupported file type");
    }

    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploaded = await getStorageProvider().upload({
        fileName: `upload.${safeExt}`,
        data: buffer,
        contentType: file.type,
        folder: "media",
      });

      const media = await mediaRepository.create({
        fileName: file.name,
        url: uploaded.url,
        mimeType: uploaded.contentType,
        size: uploaded.size,
        altAr: altAr || null,
        altEn: altEn || null,
      });

      await auditService.record(actor, {
        action: AuditAction.CREATE_MEDIA,
        entity: "Media",
        entityId: media.id,
        metadata: {
          fileName: media.fileName,
          mimeType: media.mimeType,
          size: media.size,
        },
      });

      return media;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Upload failed");
    }
  },
};
