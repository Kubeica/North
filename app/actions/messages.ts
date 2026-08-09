"use server";

import { revalidatePath } from "next/cache";

import { actionOk, type ActionResult } from "@/lib/admin/action";
import { mapDomainError } from "@/lib/admin/map-domain-error";
import {
  isActionError,
  requireActionPermission,
} from "@/lib/admin/require-action-permission";
import { messageService } from "@/src/domain/message/service";

export async function markMessageRead(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireActionPermission("messages:write");
  if (isActionError(auth)) return auth;

  try {
    const message = await messageService.markRead({ userId: auth.id }, id);
    revalidatePath("/admin/messages");
    revalidatePath("/admin/dashboard");
    return actionOk({ id: message.id }, "Marked as read");
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function archiveMessage(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireActionPermission("messages:write");
  if (isActionError(auth)) return auth;

  try {
    const message = await messageService.archive({ userId: auth.id }, id);
    revalidatePath("/admin/messages");
    revalidatePath("/admin/dashboard");
    return actionOk({ id: message.id }, "Message archived");
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function deleteMessage(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireActionPermission("messages:write");
  if (isActionError(auth)) return auth;

  try {
    const result = await messageService.delete({ userId: auth.id }, id);
    revalidatePath("/admin/messages");
    revalidatePath("/admin/dashboard");
    return actionOk(result, "Message deleted");
  } catch (error) {
    return mapDomainError(error);
  }
}
