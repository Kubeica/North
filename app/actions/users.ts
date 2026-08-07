"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  actionError,
  actionOk,
  parseBoolean,
  zodFieldErrors,
  type ActionResult,
} from "@/lib/admin/action";
import { mapDomainError } from "@/lib/admin/map-domain-error";
import { requirePermission } from "@/lib/auth/session";
import { userCreateSchema, userUpdateSchema } from "@/lib/validation/user";
import { userService } from "@/src/domain/user/service";
import type { PublicUser } from "@/types";

export async function createUser(
  formData: FormData,
): Promise<ActionResult<PublicUser>> {
  const actor = await requirePermission("users:write");
  const parsed = userCreateSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    role: String(formData.get("role") ?? "EDITOR"),
    active: parseBoolean(formData.get("active")),
  });

  if (!parsed.success) {
    return actionError("Validation failed", zodFieldErrors(parsed.error.issues));
  }

  try {
    const user = await userService.create({ userId: actor.id }, parsed.data);
    revalidatePath("/admin/users");
    return actionOk(user, "User created");
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function createUserAndRedirect(formData: FormData) {
  const result = await createUser(formData);
  if (result.ok) redirect(`/admin/users/${result.data.id}/edit`);
  return result;
}

export async function updateUser(
  formData: FormData,
): Promise<ActionResult<PublicUser>> {
  const actor = await requirePermission("users:write");
  const parsed = userUpdateSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    name: formData.get("name") ? String(formData.get("name")) : undefined,
    email: formData.get("email") ? String(formData.get("email")) : undefined,
    password: String(formData.get("password") ?? ""),
    role: formData.get("role") ? String(formData.get("role")) : undefined,
    active: parseBoolean(formData.get("active")),
  });

  if (!parsed.success) {
    return actionError("Validation failed", zodFieldErrors(parsed.error.issues));
  }

  try {
    const user = await userService.update({ userId: actor.id }, parsed.data);
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${user.id}/edit`);
    return actionOk(user, "User saved");
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function deactivateUser(
  id: string,
): Promise<ActionResult<PublicUser>> {
  const actor = await requirePermission("users:write");

  try {
    const user = await userService.deactivate({ userId: actor.id }, id);
    revalidatePath("/admin/users");
    return actionOk(user, "User deactivated");
  } catch (error) {
    return mapDomainError(error);
  }
}
