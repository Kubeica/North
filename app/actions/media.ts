"use server";

import { revalidatePath } from "next/cache";

import { actionOk, type ActionResult } from "@/lib/admin/action";
import { mapDomainError } from "@/lib/admin/map-domain-error";
import { requirePermission } from "@/lib/auth/session";
import { mediaService } from "@/src/domain/media/service";

export type MediaPickerItem = {
  id: string;
  url: string;
  fileName: string;
};

/** Lightweight list for MediaPicker browse dialog. */
export async function listMediaForPicker(): Promise<MediaPickerItem[]> {
  await requirePermission("media:read");
  const { items } = await mediaService.list({ page: 1, pageSize: 48 });
  return items.map((item) => ({
    id: item.id,
    url: item.url,
    fileName: item.fileName,
  }));
}

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
