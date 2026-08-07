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
import { requirePermission } from "@/lib/auth/session";
import { clientService } from "@/src/domain/client/service";
import {
  clientCreateSchema,
  clientUpdateSchema,
} from "@/src/domain/client/validation";

function formToClientPayload(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    logoUrl: parseOptionalString(formData.get("logoUrl")) ?? "",
    websiteUrl: parseOptionalString(formData.get("websiteUrl")) ?? "",
    descriptionAr: parseOptionalString(formData.get("descriptionAr")),
    descriptionEn: parseOptionalString(formData.get("descriptionEn")),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    published: parseBoolean(formData.get("published")),
  };
}

export async function createClient(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const user = await requirePermission("clients:write");
  const parsed = clientCreateSchema.safeParse(formToClientPayload(formData));
  if (!parsed.success) {
    return actionError("Validation failed", zodFieldErrors(parsed.error.issues));
  }

  try {
    const client = await clientService.create(
      { userId: user.id },
      parsed.data,
    );
    revalidatePath("/admin/clients");
    revalidatePath("/admin/dashboard");
    return actionOk({ id: client.id }, "Client created");
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function createClientAndRedirect(formData: FormData) {
  const result = await createClient(formData);
  if (result.ok) redirect(`/admin/clients/${result.data.id}/edit`);
  return result;
}

export async function updateClient(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const user = await requirePermission("clients:write");
  const id = String(formData.get("id") ?? "");
  const parsed = clientUpdateSchema.safeParse({
    id,
    ...formToClientPayload(formData),
  });
  if (!parsed.success) {
    return actionError("Validation failed", zodFieldErrors(parsed.error.issues));
  }

  try {
    const client = await clientService.update(
      { userId: user.id },
      parsed.data,
    );
    revalidatePath("/admin/clients");
    revalidatePath(`/admin/clients/${client.id}/edit`);
    revalidatePath("/admin/dashboard");
    return actionOk({ id: client.id }, "Client saved");
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function archiveClient(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  const user = await requirePermission("clients:write");

  try {
    const client = await clientService.archive({ userId: user.id }, id);
    revalidatePath("/admin/clients");
    revalidatePath("/admin/dashboard");
    return actionOk({ id: client.id }, "Client archived");
  } catch (error) {
    return mapDomainError(error);
  }
}
