import { actionError, type ActionResult } from "@/lib/admin/action";
import { DomainError } from "@/src/domain/shared/errors";

export function mapDomainError(error: unknown): ActionResult<never> {
  if (error instanceof DomainError) {
    return actionError(error.message);
  }
  return actionError("Something went wrong");
}
