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
import { teamService } from "@/src/domain/team/service";
import {
  teamMemberCreateSchema,
  teamMemberUpdateSchema,
} from "@/src/domain/team/validation";

function formToTeamPayload(formData: FormData) {
  return {
    nameAr: String(formData.get("nameAr") ?? ""),
    nameEn: String(formData.get("nameEn") ?? ""),
    positionAr: String(formData.get("positionAr") ?? ""),
    positionEn: String(formData.get("positionEn") ?? ""),
    bioAr: parseOptionalString(formData.get("bioAr")),
    bioEn: parseOptionalString(formData.get("bioEn")),
    imageUrl: parseOptionalString(formData.get("imageUrl")) ?? "",
    linkedin: parseOptionalString(formData.get("linkedin")) ?? "",
    email: parseOptionalString(formData.get("email")) ?? "",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    published: parseBoolean(formData.get("published")),
    isDemo: parseBoolean(formData.get("isDemo")),
  };
}

export async function createTeamMember(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireActionPermission("team:write");
  if (isActionError(auth)) return auth;

  const parsed = teamMemberCreateSchema.safeParse(formToTeamPayload(formData));
  if (!parsed.success) {
    return actionError("Validation failed", zodFieldErrors(parsed.error.issues));
  }

  try {
    const member = await teamService.create({ userId: auth.id }, parsed.data);
    revalidatePath("/admin/team");
    revalidatePublicCms({ about: true });
    return actionOk({ id: member.id }, "Team member created");
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function createTeamMemberAndRedirect(formData: FormData) {
  const result = await createTeamMember(formData);
  if (result.ok) redirect(`/admin/team/${result.data.id}/edit`);
  return result;
}

export async function updateTeamMember(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireActionPermission("team:write");
  if (isActionError(auth)) return auth;

  const id = String(formData.get("id") ?? "");
  const parsed = teamMemberUpdateSchema.safeParse({
    id,
    ...formToTeamPayload(formData),
  });
  if (!parsed.success) {
    return actionError("Validation failed", zodFieldErrors(parsed.error.issues));
  }

  try {
    const member = await teamService.update({ userId: auth.id }, parsed.data);
    revalidatePath("/admin/team");
    revalidatePath(`/admin/team/${member.id}/edit`);
    revalidatePublicCms({ about: true });
    return actionOk({ id: member.id }, "Team member saved");
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function archiveTeamMember(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireActionPermission("team:write");
  if (isActionError(auth)) return auth;

  try {
    const member = await teamService.archive({ userId: auth.id }, id);
    revalidatePath("/admin/team");
    revalidatePublicCms({ about: true });
    return actionOk({ id: member.id }, "Team member archived");
  } catch (error) {
    return mapDomainError(error);
  }
}
