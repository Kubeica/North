"use server";

import { revalidatePath } from "next/cache";

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
import { projectCategoryService } from "@/src/domain/project-category/service";
import {
  projectCategoryCreateSchema,
  projectCategoryUpdateSchema,
} from "@/src/domain/project-category/validation";

function formToCategoryPayload(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? ""),
    nameAr: String(formData.get("nameAr") ?? ""),
    nameEn: String(formData.get("nameEn") ?? ""),
    descriptionAr: parseOptionalString(formData.get("descriptionAr")),
    descriptionEn: parseOptionalString(formData.get("descriptionEn")),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
    published: parseBoolean(formData.get("published")),
  };
}

export async function createProjectCategory(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireActionPermission("projects:write");
  if (isActionError(auth)) return auth;

  const parsed = projectCategoryCreateSchema.safeParse(
    formToCategoryPayload(formData),
  );
  if (!parsed.success) {
    return actionError("Validation failed", zodFieldErrors(parsed.error.issues));
  }

  try {
    const category = await projectCategoryService.create(
      { userId: auth.id },
      parsed.data,
    );
    revalidatePath("/admin/project-categories");
    revalidatePath("/admin/projects");
    revalidatePath("/admin/projects/new");
    revalidatePublicCms({ projects: true });
    return actionOk({ id: category.id }, "Category created");
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function updateProjectCategory(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireActionPermission("projects:write");
  if (isActionError(auth)) return auth;

  const id = String(formData.get("id") ?? "");
  const parsed = projectCategoryUpdateSchema.safeParse({
    id,
    ...formToCategoryPayload(formData),
  });
  if (!parsed.success) {
    return actionError("Validation failed", zodFieldErrors(parsed.error.issues));
  }

  try {
    const category = await projectCategoryService.update(
      { userId: auth.id },
      parsed.data,
    );
    revalidatePath("/admin/project-categories");
    revalidatePath(`/admin/project-categories/${category.id}/edit`);
    revalidatePath("/admin/projects");
    revalidatePublicCms({ projects: true });
    return actionOk({ id: category.id }, "Category saved");
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function archiveProjectCategory(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  const auth = await requireActionPermission("projects:write");
  if (isActionError(auth)) return auth;

  try {
    const category = await projectCategoryService.archive(
      { userId: auth.id },
      id,
    );
    revalidatePath("/admin/project-categories");
    revalidatePath("/admin/projects");
    revalidatePublicCms({ projects: true });
    return actionOk({ id: category.id }, "Category archived");
  } catch (error) {
    return mapDomainError(error);
  }
}
