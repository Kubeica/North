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
import { milestoneService } from "@/src/domain/milestone/service";
import {
  companyMilestoneCreateSchema,
  companyMilestoneUpdateSchema,
} from "@/src/domain/milestone/validation";

function formToMilestonePayload(formData: FormData) {
  return {
    year: Number(formData.get("year") ?? new Date().getFullYear()),
    titleAr: String(formData.get("titleAr") ?? ""),
    titleEn: String(formData.get("titleEn") ?? ""),
    descriptionAr: parseOptionalString(formData.get("descriptionAr")),
    descriptionEn: parseOptionalString(formData.get("descriptionEn")),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    published: parseBoolean(formData.get("published")),
  };
}

export async function createCompanyMilestone(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const user = await requirePermission("milestones:write");
  const parsed = companyMilestoneCreateSchema.safeParse(
    formToMilestonePayload(formData),
  );
  if (!parsed.success) {
    return actionError("Validation failed", zodFieldErrors(parsed.error.issues));
  }

  try {
    const milestone = await milestoneService.create(
      { userId: user.id },
      parsed.data,
    );
    revalidatePath("/admin/milestones");
    revalidatePath("/[locale]/about", "page");
    return actionOk({ id: milestone.id }, "Milestone created");
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function createCompanyMilestoneAndRedirect(formData: FormData) {
  const result = await createCompanyMilestone(formData);
  if (result.ok) redirect(`/admin/milestones/${result.data.id}/edit`);
  return result;
}

export async function updateCompanyMilestone(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const user = await requirePermission("milestones:write");
  const id = String(formData.get("id") ?? "");
  const parsed = companyMilestoneUpdateSchema.safeParse({
    id,
    ...formToMilestonePayload(formData),
  });
  if (!parsed.success) {
    return actionError("Validation failed", zodFieldErrors(parsed.error.issues));
  }

  try {
    const milestone = await milestoneService.update(
      { userId: user.id },
      parsed.data,
    );
    revalidatePath("/admin/milestones");
    revalidatePath(`/admin/milestones/${milestone.id}/edit`);
    revalidatePath("/[locale]/about", "page");
    return actionOk({ id: milestone.id }, "Milestone saved");
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function deleteCompanyMilestone(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  const user = await requirePermission("milestones:write");

  try {
    const milestone = await milestoneService.delete({ userId: user.id }, id);
    revalidatePath("/admin/milestones");
    revalidatePath("/[locale]/about", "page");
    return actionOk({ id: milestone.id }, "Milestone deleted");
  } catch (error) {
    return mapDomainError(error);
  }
}
