"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  actionError,
  actionOk,
  parseBoolean,
  parseOptionalString,
  zodFieldErrors,
  type ActionResult,
} from "@/lib/admin/action";
import { mapDomainError } from "@/lib/admin/map-domain-error";
import {
  isActionError,
  requireActionPermission,
} from "@/lib/admin/require-action-permission";
import { revalidatePublicCms } from "@/lib/admin/revalidate-public";
import { serviceService } from "@/src/domain/service/service";
import {
  serviceCreateSchema,
  serviceUpdateSchema,
} from "@/src/domain/service/validation";

function formToServicePayload(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? ""),
    nameAr: String(formData.get("nameAr") ?? ""),
    nameEn: String(formData.get("nameEn") ?? ""),
    descriptionAr: String(formData.get("descriptionAr") ?? ""),
    descriptionEn: String(formData.get("descriptionEn") ?? ""),
    icon: parseOptionalString(formData.get("icon")),
    imageUrl: parseOptionalString(formData.get("imageUrl")) ?? "",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    published: parseBoolean(formData.get("published")),
    isDemo: parseBoolean(formData.get("isDemo")),
  };
}

export async function createService(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireActionPermission("services:write");
  if (isActionError(auth)) return auth;

  const parsed = serviceCreateSchema.safeParse(formToServicePayload(formData));
  if (!parsed.success) {
    return actionError("Validation failed", zodFieldErrors(parsed.error.issues));
  }

  try {
    const service = await serviceService.create(
      { userId: auth.id },
      parsed.data,
    );
    revalidatePath("/admin/services");
    revalidatePath("/admin/dashboard");
    revalidatePublicCms({ services: true, home: true });
    return actionOk({ id: service.id }, "Service created");
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function createServiceAndRedirect(formData: FormData) {
  const result = await createService(formData);
  if (result.ok) redirect(`/admin/services/${result.data.id}/edit`);
  return result;
}

export async function updateService(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireActionPermission("services:write");
  if (isActionError(auth)) return auth;

  const id = String(formData.get("id") ?? "");
  const parsed = serviceUpdateSchema.safeParse({
    id,
    ...formToServicePayload(formData),
  });
  if (!parsed.success) {
    return actionError("Validation failed", zodFieldErrors(parsed.error.issues));
  }

  try {
    const service = await serviceService.update(
      { userId: auth.id },
      parsed.data,
    );
    revalidatePath("/admin/services");
    revalidatePath(`/admin/services/${service.id}/edit`);
    revalidatePath("/admin/dashboard");
    revalidatePublicCms({ services: true, home: true });
    return actionOk({ id: service.id }, "Service saved");
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function archiveService(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireActionPermission("services:write");
  if (isActionError(auth)) return auth;

  try {
    const service = await serviceService.archive({ userId: auth.id }, id);
    revalidatePath("/admin/services");
    revalidatePath("/admin/dashboard");
    revalidatePublicCms({ services: true, home: true });
    return actionOk({ id: service.id }, "Service archived");
  } catch (error) {
    return mapDomainError(error);
  }
}
