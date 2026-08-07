import { auditRepository } from "@/src/domain/audit/repository";
import { clientRepository } from "@/src/domain/client/repository";
import { messageRepository } from "@/src/domain/message/repository";
import { projectRepository } from "@/src/domain/project/repository";
import { serviceRepository } from "@/src/domain/service/repository";
import type { DomainActor } from "@/src/domain/shared/actor";
import { userRepository } from "@/src/domain/user/repository";

export type AdminOverviewOptions = {
  /** When true, include active user count (admin-only surface). */
  includeUsers?: boolean;
  /** When true, include recent audit entries (admin-only / audit:read). */
  includeAudit?: boolean;
};

export const dashboardService = {
  async getAdminOverview(
    _actor?: DomainActor | null,
    options: AdminOverviewOptions = {},
  ) {
    const includeUsers = options.includeUsers ?? false;
    const includeAudit = options.includeAudit ?? false;

    const [
      totalProjects,
      completedProjects,
      activeProjects,
      servicesCount,
      clientsCount,
      unreadMessages,
      usersCount,
      recentProjects,
      recentMessages,
      recentAudit,
    ] = await Promise.all([
      projectRepository.countActive(),
      projectRepository.countByStatus("COMPLETED"),
      projectRepository.countByStatus("IN_PROGRESS"),
      serviceRepository.countActive(),
      clientRepository.countActive(),
      messageRepository.countUnread(),
      includeUsers ? userRepository.countActive() : Promise.resolve(0),
      projectRepository.listRecent(5),
      messageRepository.listRecent(5),
      includeAudit ? auditRepository.listRecent(8) : Promise.resolve([]),
    ]);

    return {
      totalProjects,
      completedProjects,
      activeProjects,
      servicesCount,
      clientsCount,
      unreadMessages,
      usersCount,
      recentProjects,
      recentMessages,
      recentAudit,
    };
  },
};
