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
import { requirePermission } from "@/lib/auth/session";
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
  const user = await requirePermission("statistics:write");
  const parsed = statisticCreateSchema.safeParse(
    formToStatisticPayload(formData),
  );
  if (!parsed.success) {
    return actionError("Validation failed", zodFieldErrors(parsed.error.issues));
  }

  try {
    const statistic = await statisticService.create(
      { userId: user.id },
      parsed.data,
    );
    revalidatePath("/admin/statistics");
    revalidatePath("/admin/dashboard");
    revalidatePath("/[locale]", "page");
    return actionOk({ id: statistic.id }, "Statistic created");
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function updateStatistic(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const user = await requirePermission("statistics:write");
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
      { userId: user.id },
      parsed.data,
    );
    revalidatePath("/admin/statistics");
    revalidatePath(`/admin/statistics/${statistic.id}/edit`);
    revalidatePath("/admin/dashboard");
    revalidatePath("/[locale]", "page");
    return actionOk({ id: statistic.id }, "Statistic saved");
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function archiveStatistic(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  const user = await requirePermission("statistics:write");

  try {
    const statistic = await statisticService.archive({ userId: user.id }, id);
    revalidatePath("/admin/statistics");
    revalidatePath("/admin/dashboard");
    revalidatePath("/[locale]", "page");
    return actionOk({ id: statistic.id }, "Statistic archived");
  } catch (error) {
    return mapDomainError(error);
  }
}
