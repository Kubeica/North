import { describe, expect, it, vi } from "vitest";

import { ForbiddenError } from "@/src/domain/shared/errors";

vi.mock("@/src/domain/user/repository", () => ({
  userRepository: {
    findById: vi.fn(async (id: string) =>
      id === "self-id"
        ? {
            id: "self-id",
            email: "me@example.com",
            name: "Me",
            role: "ADMIN",
            active: true,
          }
        : {
            id,
            email: "other@example.com",
            name: "Other",
            role: "EDITOR",
            active: true,
          },
    ),
    update: vi.fn(async (id: string, data: { active?: boolean }) => ({
      id,
      email: "me@example.com",
      name: "Me",
      role: "ADMIN",
      active: data.active ?? true,
    })),
  },
}));

vi.mock("@/src/domain/audit/service", () => ({
  auditService: {
    record: vi.fn(async () => undefined),
  },
}));

vi.mock("@/lib/auth/password", () => ({
  hashPassword: vi.fn(async () => "hash"),
  verifyPassword: vi.fn(async () => true),
}));

describe("userService.update self-deactivate", () => {
  it("forbids deactivating your own account via update", async () => {
    const { userService } = await import("@/src/domain/user/service");

    await expect(
      userService.update(
        { userId: "self-id" },
        {
          id: "self-id",
          password: undefined,
          active: false,
        },
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("allows deactivating another user", async () => {
    const { userService } = await import("@/src/domain/user/service");
    const { userRepository } = await import("@/src/domain/user/repository");

    const user = await userService.update(
      { userId: "self-id" },
      {
        id: "other-id",
        password: undefined,
        active: false,
      },
    );

    expect(user.active).toBe(false);
    expect(userRepository.update).toHaveBeenCalled();
  });
});
