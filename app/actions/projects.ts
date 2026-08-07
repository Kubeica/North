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
import { projectService } from "@/src/domain/project/service";
import {
  projectCreateSchema,
  projectUpdateSchema,
} from "@/src/domain/project/validation";

function parseGalleryUrls(formData: FormData): string[] {
  const raw = String(formData.get("galleryUrls") ?? "");
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function formToProjectPayload(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? ""),
    titleAr: String(formData.get("titleAr") ?? ""),
    titleEn: String(formData.get("titleEn") ?? ""),
    summaryAr: parseOptionalString(formData.get("summaryAr")),
    summaryEn: parseOptionalString(formData.get("summaryEn")),
    descriptionAr: String(formData.get("descriptionAr") ?? ""),
    descriptionEn: String(formData.get("descriptionEn") ?? ""),
    locationAr: parseOptionalString(formData.get("locationAr")),
    locationEn: parseOptionalString(formData.get("locationEn")),
    coverImageUrl: parseOptionalString(formData.get("coverImageUrl")) ?? "",
    clientId: parseOptionalString(formData.get("clientId")) ?? "",
    categoryId: parseOptionalString(formData.get("categoryId")) ?? "",
    status: String(formData.get("status") ?? "PLANNED"),
    startDate: formData.get("startDate")
      ? String(formData.get("startDate"))
      : null,
    completionDate: formData.get("completionDate")
      ? String(formData.get("completionDate"))
      : null,
    featured: parseBoolean(formData.get("featured")),
    published: parseBoolean(formData.get("published")),
    seoTitleAr: parseOptionalString(formData.get("seoTitleAr")),
    seoTitleEn: parseOptionalString(formData.get("seoTitleEn")),
    seoDescriptionAr: parseOptionalString(formData.get("seoDescriptionAr")),
    seoDescriptionEn: parseOptionalString(formData.get("seoDescriptionEn")),
    scopeAr: parseOptionalString(formData.get("scopeAr")),
    scopeEn: parseOptionalString(formData.get("scopeEn")),
    isDemo: parseBoolean(formData.get("isDemo")),
  };
}

export async function createProject(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const user = await requirePermission("projects:write");
  const parsed = projectCreateSchema.safeParse(formToProjectPayload(formData));
  if (!parsed.success) {
    return actionError("Validation failed", zodFieldErrors(parsed.error.issues));
  }

  try {
    const project = await projectService.create(
      { userId: user.id },
      {
        ...parsed.data,
        galleryUrls: parseGalleryUrls(formData),
      },
    );

    revalidatePath("/admin/projects");
    revalidatePath("/admin/dashboard");
    return actionOk({ id: project.id }, "Project created");
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function createProjectAndRedirect(formData: FormData) {
  const result = await createProject(formData);
  if (result.ok) redirect(`/admin/projects/${result.data.id}/edit`);
  return result;
}

export async function updateProject(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const user = await requirePermission("projects:write");
  const id = String(formData.get("id") ?? "");
  const parsed = projectUpdateSchema.safeParse({
    id,
    ...formToProjectPayload(formData),
  });
  if (!parsed.success) {
    return actionError("Validation failed", zodFieldErrors(parsed.error.issues));
  }

  try {
    const project = await projectService.update(
      { userId: user.id },
      {
        ...parsed.data,
        galleryUrls: parseGalleryUrls(formData),
      },
    );

    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${project.id}/edit`);
    revalidatePath("/admin/dashboard");
    return actionOk({ id: project.id }, "Project saved");
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function archiveProject(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  const user = await requirePermission("projects:write");

  try {
    const project = await projectService.archive({ userId: user.id }, id);
    revalidatePath("/admin/projects");
    revalidatePath("/admin/dashboard");
    return actionOk({ id: project.id }, "Project archived");
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function duplicateProject(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  const user = await requirePermission("projects:write");

  try {
    const project = await projectService.duplicate({ userId: user.id }, id);
    revalidatePath("/admin/projects");
    return actionOk({ id: project.id }, "Project duplicated");
  } catch (error) {
    return mapDomainError(error);
  }
}
