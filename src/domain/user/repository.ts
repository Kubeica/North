import type { Role } from "@prisma/client";

import { prisma, type Prisma } from "@/src/domain/shared/prisma";
import { rethrowIfUniqueConflict } from "@/src/domain/shared/prisma-errors";
import {
  normalizePage,
  normalizePageSize,
  paginate,
  toSkipTake,
} from "@/src/domain/shared/query";

type Db = Prisma.TransactionClient | typeof prisma;

const publicSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  active: true,
  createdAt: true,
  updatedAt: true,
} as const;

const authSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  active: true,
  passwordHash: true,
} as const;

export type UserCreateData = {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  active: boolean;
};

export type UserUpdateData = {
  name?: string;
  email?: string;
  passwordHash?: string;
  role?: Role;
  active?: boolean;
};

export type UserListParams = {
  q?: string;
  role?: Role | string;
  active?: boolean;
  page?: number;
  pageSize?: number;
};

export const userRepository = {
  async findById(id: string, db: Db = prisma) {
    return db.user.findUnique({
      where: { id },
      select: publicSelect,
    });
  },

  async findByEmail(email: string, db: Db = prisma) {
    return db.user.findUnique({
      where: { email: email.toLowerCase() },
      select: publicSelect,
    });
  },

  /** Includes passwordHash — for auth infrastructure only. */
  async findByEmailForAuth(email: string, db: Db = prisma) {
    return db.user.findUnique({
      where: { email: email.toLowerCase() },
      select: authSelect,
    });
  },

  async list(params: UserListParams = {}) {
    const page = normalizePage(params.page);
    const pageSize = normalizePageSize(params.pageSize);
    const { skip, take } = toSkipTake(page, pageSize);
    const q = params.q?.trim() ?? "";
    const role =
      params.role === "ADMIN" || params.role === "EDITOR"
        ? params.role
        : undefined;

    const where: Prisma.UserWhereInput = {
      ...(role ? { role } : {}),
      ...(params.active !== undefined ? { active: params.active } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [total, items] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          active: true,
          createdAt: true,
        },
      }),
    ]);

    return paginate(items, total, page, pageSize);
  },

  async create(data: UserCreateData, db: Db = prisma) {
    try {
      return await db.user.create({
        data: {
          name: data.name,
          email: data.email.toLowerCase(),
          passwordHash: data.passwordHash,
          role: data.role,
          active: data.active,
        },
        select: publicSelect,
      });
    } catch (error) {
      rethrowIfUniqueConflict(error, "A user with this email already exists");
    }
  },

  async update(id: string, data: UserUpdateData, db: Db = prisma) {
    try {
      return await db.user.update({
        where: { id },
        data: {
          ...(data.name !== undefined ? { name: data.name } : {}),
          ...(data.email !== undefined
            ? { email: data.email.toLowerCase() }
            : {}),
          ...(data.passwordHash !== undefined
            ? { passwordHash: data.passwordHash }
            : {}),
          ...(data.role !== undefined ? { role: data.role } : {}),
          ...(data.active !== undefined ? { active: data.active } : {}),
        },
        select: publicSelect,
      });
    } catch (error) {
      rethrowIfUniqueConflict(error, "A user with this email already exists");
    }
  },

  async deactivate(id: string, db: Db = prisma) {
    return db.user.update({
      where: { id },
      data: { active: false },
      select: publicSelect,
    });
  },

  async countActive(db: Db = prisma) {
    return db.user.count({ where: { active: true } });
  },

  async count(db: Db = prisma) {
    return db.user.count();
  },
};
