import { AuditAction } from "@/lib/audit/actions";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { auditService } from "@/src/domain/audit/service";
import type { DomainActor } from "@/src/domain/shared/actor";
import {
  DomainError,
  ForbiddenError,
  NotFoundError,
} from "@/src/domain/shared/errors";
import type { UserCreateInput, UserUpdateInput } from "@/src/domain/user/validation";
import {
  userRepository,
  type UserListParams,
} from "@/src/domain/user/repository";

export const userService = {
  async list(params: UserListParams = {}) {
    return userRepository.list(params);
  },

  async getById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError("User not found");
    return user;
  },

  async create(actor: DomainActor, input: UserCreateInput) {
    try {
      const passwordHash = await hashPassword(input.password);
      const user = await userRepository.create({
        name: input.name,
        email: input.email,
        passwordHash,
        role: input.role,
        active: input.active,
      });

      await auditService.record(actor, {
        action: AuditAction.CREATE_USER,
        entity: "User",
        entityId: user.id,
        metadata: { email: user.email, role: user.role },
      });

      return user;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to create user");
    }
  },

  async update(actor: DomainActor, input: UserUpdateInput) {
    const { id, password, ...rest } = input;
    const existing = await userRepository.findById(id);
    if (!existing) throw new NotFoundError("User not found");

    try {
      const passwordHash = password ? await hashPassword(password) : undefined;
      const user = await userRepository.update(id, {
        ...rest,
        ...(passwordHash ? { passwordHash } : {}),
      });

      await auditService.record(actor, {
        action: AuditAction.UPDATE_USER,
        entity: "User",
        entityId: user.id,
        metadata: {
          email: user.email,
          role: user.role,
          passwordChanged: Boolean(password),
        },
      });

      return user;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to update user");
    }
  },

  async deactivate(actor: DomainActor, id: string) {
    if (actor.userId === id) {
      throw new ForbiddenError("You cannot deactivate your own account");
    }

    const existing = await userRepository.findById(id);
    if (!existing) throw new NotFoundError("User not found");

    try {
      const user = await userRepository.deactivate(id);

      await auditService.record(actor, {
        action: AuditAction.DEACTIVATE_USER,
        entity: "User",
        entityId: user.id,
        metadata: { email: user.email },
      });

      return user;
    } catch (error) {
      if (error instanceof DomainError) throw error;
      throw new DomainError("Failed to deactivate user");
    }
  },

  async countActive() {
    return userRepository.countActive();
  },

  /**
   * Optional auth helper. Returns public user fields only (no passwordHash).
   * Password verification stays in the caller or here — never in the repository.
   */
  async verifyCredentials(email: string, password: string) {
    const user = await userRepository.findByEmailForAuth(email);
    if (!user || !user.active) return null;

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
    };
  },
};
