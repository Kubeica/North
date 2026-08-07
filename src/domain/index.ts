export { auditService } from "@/src/domain/audit/service";
export { projectService } from "@/src/domain/project/service";
export { serviceService } from "@/src/domain/service/service";
export { clientService } from "@/src/domain/client/service";
export { teamService } from "@/src/domain/team/service";
export { milestoneService } from "@/src/domain/milestone/service";
export { mediaService } from "@/src/domain/media/service";
export { settingsService } from "@/src/domain/settings/service";
export { userService } from "@/src/domain/user/service";
export { messageService } from "@/src/domain/message/service";
export { contactService } from "@/src/domain/contact/service";
export { statisticService } from "@/src/domain/statistic/service";
export { dashboardService } from "@/src/domain/dashboard/service";
export { rateLimitService } from "@/src/domain/rate-limit/service";

export type { DomainActor } from "@/src/domain/shared/actor";
export type { ListParams, PaginatedResult } from "@/src/domain/shared/query";
export {
  DomainError,
  NotFoundError,
  ConflictError,
  ForbiddenError,
} from "@/src/domain/shared/errors";
