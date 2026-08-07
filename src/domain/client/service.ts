import { AuditAction } from "@/lib/audit/actions";
import { auditService } from "@/src/domain/audit/service";
import {
  clientRepository,
  type ClientListParams,
} from "@/src/domain/client/repository";
import type {
  ClientCreateInput,
  ClientUpdateInput,
} from "@/src/domain/client/validation";
import type { DomainActor } from "@/src/domain/shared/actor";
import { DomainError, NotFoundError } from "@/src/domain/shared/errors";

export const clientService = {
  async list(params: ClientListParams = {}) {
    return clientRepository.list(params);
  },

  async getById(id: string) {
    const client = await clientRepository.findById(id);
    if (!client || client.archivedAt) {
      throw new NotFoundError("Client not found");
    }
    return client;
  },

  async listPublished() {
    return clientRepository.listPublished();
  },

  async listOptions() {
    return clientRepository.listOptions();
  },

  async create(actor: DomainActor, input: ClientCreateInput) {
    try {
      const client = await clientRepository.create(input);

      await auditService.record(actor, {
        action: AuditAction.CREATE_CLIENT,
        entity: "Client",
        entityId: client.id,
        metadata: { name: client.name },
      });

      return client;
    } catch {
      throw new DomainError("Failed to create client");
    }
  },

  async update(actor: DomainActor, input: ClientUpdateInput) {
    const { id, ...data } = input;
    const existing = await clientRepository.findById(id);
    if (!existing || existing.archivedAt) {
      throw new NotFoundError("Client not found");
    }

    try {
      const client = await clientRepository.update(id, data);

      await auditService.record(actor, {
        action: AuditAction.UPDATE_CLIENT,
        entity: "Client",
        entityId: client.id,
        metadata: { name: client.name },
      });

      return client;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to update client");
    }
  },

  async archive(actor: DomainActor, id: string) {
    const existing = await clientRepository.findById(id);
    if (!existing || existing.archivedAt) {
      throw new NotFoundError("Client not found");
    }

    try {
      const client = await clientRepository.archive(id);

      await auditService.record(actor, {
        action: AuditAction.ARCHIVE_CLIENT,
        entity: "Client",
        entityId: client.id,
        metadata: { name: client.name },
      });

      return client;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to archive client");
    }
  },
};
