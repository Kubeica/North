"use server";

import { revalidatePath } from "next/cache";

import { actionOk, type ActionResult } from "@/lib/admin/action";
import { mapDomainError } from "@/lib/admin/map-domain-error";
import {
  isActionError,
  requireActionPermission,
} from "@/lib/admin/require-action-permission";
import { mediaService } from "@/src/domain/media/service";

export type MediaPickerItem = {
  id: string;
  url: string;
  fileName: string;
};

/** Lightweight list for MediaPicker browse dialog. */
export async function listMediaForPicker(): Promise<MediaPickerItem[]> {
  const auth = await requireActionPermission("media:read");
  if (isActionError(auth)) {
    throw new Error(auth.error);
  }

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
  const auth = await requireActionPermission("media:write");
  if (isActionError(auth)) return auth;

  try {
    const media = await mediaService.archive({ userId: auth.id }, id);
    revalidatePath("/admin/media");
    return actionOk({ id: media.id }, "Media archived");
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function deleteMedia(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireActionPermission("media:write");
  if (isActionError(auth)) return auth;

  try {
    const result = await mediaService.delete({ userId: auth.id }, id);
    revalidatePath("/admin/media");
    return actionOk({ id: result.id }, "Media deleted");
  } catch (error) {
    return mapDomainError(error);
  }
}
