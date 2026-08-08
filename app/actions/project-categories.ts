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
import { requirePermission } from "@/lib/auth/session";
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
  const user = await requirePermission("projects:write");
  const parsed = projectCategoryCreateSchema.safeParse(
    formToCategoryPayload(formData),
  );
  if (!parsed.success) {
    return actionError("Validation failed", zodFieldErrors(parsed.error.issues));
  }

  try {
    const category = await projectCategoryService.create(
      { userId: user.id },
      parsed.data,
    );
    revalidatePath("/admin/project-categories");
    revalidatePath("/admin/projects");
    revalidatePath("/admin/projects/new");
    revalidatePath("/[locale]/projects", "page");
    return actionOk({ id: category.id }, "Category created");
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function updateProjectCategory(
  formData: FormData,
): Promise<ActionResult<{ id: string }>> {
  const user = await requirePermission("projects:write");
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
      { userId: user.id },
      parsed.data,
    );
    revalidatePath("/admin/project-categories");
    revalidatePath(`/admin/project-categories/${category.id}/edit`);
    revalidatePath("/admin/projects");
    revalidatePath("/[locale]/projects", "page");
    return actionOk({ id: category.id }, "Category saved");
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function archiveProjectCategory(
  id: string,
): Promise<ActionResult<{ id: string }>> {
  const user = await requirePermission("projects:write");

  try {
    const category = await projectCategoryService.archive(
      { userId: user.id },
      id,
    );
    revalidatePath("/admin/project-categories");
    revalidatePath("/admin/projects");
    revalidatePath("/[locale]/projects", "page");
    return actionOk({ id: category.id }, "Category archived");
  } catch (error) {
    return mapDomainError(error);
  }
}
