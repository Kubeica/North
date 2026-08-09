"use server";

import { revalidatePath } from "next/cache";

import {
  actionError,
  actionOk,
  parseBoolean,
  zodFieldErrors,
  type ActionResult,
} from "@/lib/admin/action";
import { mapDomainError } from "@/lib/admin/map-domain-error";
import {
  isActionError,
  requireActionPermission,
} from "@/lib/admin/require-action-permission";
import { revalidatePublicCms } from "@/lib/admin/revalidate-public";
import { statisticService } from "@/src/domain/statistic/service";
import {
  statisticCreateSchema,
  statisticUpdateSchema,
} from "@/src/domain/statistic/validation";

function formToStatisticPayload(formData: FormData) {
  return {
    labelAr: String(formData.get("labelAr") ?? ""),
    labelEn: String(formData.get("labelEn") ?? ""),
    value: String(formData.get("value") ?? ""),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    published: parseBoolean(formData.get("published")),
  };
}

export async function createStatistic(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireActionPermission("statistics:write");
  if (isActionError(auth)) return auth;

  const parsed = statisticCreateSchema.safeParse(
    formToStatisticPayload(formData),
  );
  if (!parsed.success) {
    return actionError("Validation failed", zodFieldErrors(parsed.error.issues));
  }

  try {
    const statistic = await statisticService.create(
      { userId: auth.id },
      parsed.data,
    );
    revalidatePath("/admin/statistics");
    revalidatePath("/admin/dashboard");
    revalidatePublicCms({ home: true });
    return actionOk({ id: statistic.id }, "Statistic created");
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function updateStatistic(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireActionPermission("statistics:write");
  if (isActionError(auth)) return auth;

  const id = String(formData.get("id") ?? "");
  const parsed = statisticUpdateSchema.safeParse({
    id,
    ...formToStatisticPayload(formData),
  });
  if (!parsed.success) {
    return actionError("Validation failed", zodFieldErrors(parsed.error.issues));
  }

  try {
    const statistic = await statisticService.update(
      { userId: auth.id },
      parsed.data,
    );
    revalidatePath("/admin/statistics");
    revalidatePath(`/admin/statistics/${statistic.id}/edit`);
    revalidatePath("/admin/dashboard");
    revalidatePublicCms({ home: true });
    return actionOk({ id: statistic.id }, "Statistic saved");
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function archiveStatistic(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireActionPermission("statistics:write");
  if (isActionError(auth)) return auth;

  try {
    const statistic = await statisticService.archive({ userId: auth.id }, id);
    revalidatePath("/admin/statistics");
    revalidatePath("/admin/dashboard");
    revalidatePublicCms({ home: true });
    return actionOk({ id: statistic.id }, "Statistic archived");
  } catch (error) {
    return mapDomainError(error);
  }
}
