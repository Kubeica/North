"use server";

import { revalidatePath } from "next/cache";

import { actionOk, type ActionResult } from "@/lib/admin/action";
import { mapDomainError } from "@/lib/admin/map-domain-error";
import { requirePermission } from "@/lib/auth/session";
import { mediaService } from "@/src/domain/media/service";

export async function archiveMedia(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  const user = await requirePermission("media:write");

  try {
    const media = await mediaService.archive({ userId: user.id }, id);
    revalidatePath("/admin/media");
    return actionOk({ id: media.id }, "Media archived");
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function deleteMedia(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  const user = await requirePermission("media:write");

  try {
    const result = await mediaService.delete({ userId: user.id }, id);
    revalidatePath("/admin/media");
    return actionOk({ id: result.id }, "Media deleted");
  } catch (error) {
    return mapDomainError(error);
  }
}
