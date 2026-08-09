import { actionError, type ActionResult } from "@/lib/admin/action";
import { assertPermission } from "@/lib/auth/session";
import type { Permission } from "@/lib/permissions";
import type { SessionUser } from "@/types";

type ActionAuthError = Extract<ActionResult<never>, { ok: false }>;

/**
 * Server-action auth: returns SessionUser or a structured ActionResult error.
 * Prefer this over requirePermission (which redirects) inside mutation actions.
 */
export async function requireActionPermission(
  permission: Permission,
): Promise<SessionUser | ActionAuthError> {
  try {
    return await assertPermission(permission);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "UNAUTHORIZED") {
      return actionError("Please sign in again") as ActionAuthError;
    }
    if (message === "FORBIDDEN") {
      return actionError(
        "You do not have permission for this action",
      ) as ActionAuthError;
    }
    throw error;
  }
}

export function isActionError(
  value: SessionUser | ActionAuthError,
): value is ActionAuthError {
  return typeof value === "object" && value !== null && "ok" in value;
}
