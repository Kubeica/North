"use server";

import { revalidatePath } from "next/cache";

import {
  actionOk,
  type ActionResult,
} from "@/lib/admin/action";
import { mapDomainError } from "@/lib/admin/map-domain-error";
import { requirePermission } from "@/lib/auth/session";
import { messageService } from "@/src/domain/message/service";

export async function markMessageRead(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  const user = await requirePermission("messages:write");

  try {
    const message = await messageService.markRead({ userId: user.id }, id);
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
  const user = await requirePermission("messages:write");

  try {
    const message = await messageService.archive({ userId: user.id }, id);
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
  const user = await requirePermission("messages:write");

  try {
    const result = await messageService.delete({ userId: user.id }, id);
    revalidatePath("/admin/messages");
    revalidatePath("/admin/dashboard");
    return actionOk(result, "Message deleted");
  } catch (error) {
    return mapDomainError(error);
  }
}
