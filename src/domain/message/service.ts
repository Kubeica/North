import { AuditAction } from "@/lib/audit/actions";
import { auditService } from "@/src/domain/audit/service";
import {
  messageRepository,
  type MessageListParams,
} from "@/src/domain/message/repository";
import type { MessageCreateInput } from "@/src/domain/message/validation";
import type { DomainActor } from "@/src/domain/shared/actor";
import { DomainError, NotFoundError } from "@/src/domain/shared/errors";

export const messageService = {
  async list(params: MessageListParams = {}) {
    return messageRepository.list(params);
  },

  async getById(id: string) {
    const message = await messageRepository.findById(id);
    if (!message) throw new NotFoundError("Message not found");
    return message;
  },

  async listRecent(limit = 5) {
    return messageRepository.listRecent(limit);
  },

  async countUnread() {
    return messageRepository.countUnread();
  },

  async create(input: MessageCreateInput) {
    try {
      return await messageRepository.create(input);
    } catch {
      throw new DomainError("Failed to create message");
    }
  },

  async markRead(actor: DomainActor, id: string) {
    const existing = await messageRepository.findById(id);
    if (!existing) throw new NotFoundError("Message not found");

    try {
      const message = await messageRepository.updateStatus(id, "READ");

      await auditService.record(actor, {
        action: AuditAction.MARK_MESSAGE_READ,
        entity: "ContactMessage",
        entityId: message.id,
      });

      return message;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to update message");
    }
  },

  async archive(actor: DomainActor, id: string) {
    const existing = await messageRepository.findById(id);
    if (!existing) throw new NotFoundError("Message not found");

    try {
      const message = await messageRepository.updateStatus(id, "ARCHIVED");

      await auditService.record(actor, {
        action: AuditAction.ARCHIVE_MESSAGE,
        entity: "ContactMessage",
        entityId: message.id,
      });

      return message;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to archive message");
    }
  },

  async delete(actor: DomainActor, id: string) {
    const existing = await messageRepository.findById(id);
    if (!existing) throw new NotFoundError("Message not found");

    try {
      await messageRepository.delete(id);

      await auditService.record(actor, {
        action: AuditAction.DELETE_MESSAGE,
        entity: "ContactMessage",
        entityId: id,
      });

      return { id };
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to delete message");
    }
  },
};
