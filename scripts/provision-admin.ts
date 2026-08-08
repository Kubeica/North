/**
 * One-time / idempotent production ADMIN bootstrap.
 *
 * Required env:
 *   ADMIN_EMAIL
 *   ADMIN_PASSWORD
 * Optional:
 *   ADMIN_NAME  (default: "Administrator")
 *   DATABASE_URL (required by Prisma)
 *
 * Never run prisma/seed for production admin creation.
 * Does not print the password.
 */

import { AuditAction } from "@/lib/audit/actions";
import { hashPassword } from "@/lib/auth/password";
import { can, isAdmin } from "@/lib/permissions";
import { auditService } from "@/src/domain/audit/service";
import { userRepository } from "@/src/domain/user/repository";
import { userCreateSchema } from "@/src/domain/user/validation";

function requireEnv(name: string): string {
  const value = process.env[name]?.trim() ?? "";
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

async function main() {
  const email = requireEnv("ADMIN_EMAIL").toLowerCase();
  const password = requireEnv("ADMIN_PASSWORD");
  const name = process.env.ADMIN_NAME?.trim() || "Administrator";

  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error("Missing required environment variable: DATABASE_URL");
  }

  const parsed = userCreateSchema.safeParse({
    name,
    email,
    password,
    role: "ADMIN",
    active: true,
  });
  if (!parsed.success) {
    const messages = parsed.error.issues.map((issue) => {
      // Never echo password values — only field path + message.
      return `${issue.path.join(".") || "input"}: ${issue.message}`;
    });
    throw new Error(`Validation failed: ${messages.join("; ")}`);
  }

  const existing = await userRepository.findByEmail(parsed.data.email);
  if (existing) {
    if (!isAdmin(existing.role) || !existing.active) {
      console.error(
        [
          "status=exists_conflict",
          `email=${existing.email}`,
          `role=${existing.role}`,
          `active=${existing.active}`,
          "message=User already exists but is not an active ADMIN. Resolve manually; password was not changed.",
        ].join(" "),
      );
      process.exit(2);
    }

    if (!can(existing.role, "users:write") || !can(existing.role, "settings:write")) {
      console.error("status=permission_check_failed role=ADMIN");
      process.exit(1);
    }

    console.log(
      [
        "status=exists",
        `id=${existing.id}`,
        `email=${existing.email}`,
        `role=${existing.role}`,
        `active=${existing.active}`,
        "message=Active ADMIN already present; no changes made.",
      ].join(" "),
    );
    return;
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await userRepository.create({
    name: parsed.data.name,
    email: parsed.data.email,
    passwordHash,
    role: "ADMIN",
    active: true,
  });

  await auditService.record(null, {
    action: AuditAction.CREATE_USER,
    entity: "User",
    entityId: user.id,
    metadata: {
      email: user.email,
      role: user.role,
      source: "scripts/provision-admin.ts",
    },
  });

  if (!isAdmin(user.role) || !user.active) {
    throw new Error("Created user failed ADMIN/active verification");
  }
  if (!can(user.role, "users:write") || !can(user.role, "settings:write")) {
    throw new Error("Created ADMIN failed permission verification");
  }

  console.log(
    [
      "status=created",
      `id=${user.id}`,
      `email=${user.email}`,
      `role=${user.role}`,
      `active=${user.active}`,
      "message=Production ADMIN provisioned. Sign in at /admin/login",
    ].join(" "),
  );
}

main()
  .catch((error) => {
    const message = error instanceof Error ? error.message : "unknown_error";
    // Strip accidental password leakage if an error string ever embeds env dump.
    const safe = message.replace(
      /ADMIN_PASSWORD[=:].*/gi,
      "ADMIN_PASSWORD=[REDACTED]",
    );
    console.error(`status=error message=${safe}`);
    process.exit(1);
  })
  .finally(async () => {
    // Prisma keeps the process alive until disconnect.
    const { prisma } = await import("@/src/domain/shared/prisma");
    await prisma.$disconnect().catch(() => undefined);
  });
