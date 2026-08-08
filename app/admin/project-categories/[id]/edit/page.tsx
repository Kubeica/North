import { notFound } from "next/navigation";

import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectCategoryForm } from "@/components/admin/forms/ProjectCategoryForm";
import { requirePermission } from "@/lib/auth/session";
import { projectCategoryService } from "@/src/domain/project-category/service";
import { NotFoundError } from "@/src/domain/shared/errors";

export const metadata = { title: "Edit project category" };

type Params = Promise<{ id: string }>;

export default async function EditProjectCategoryPage({
  params,
}: {
  params: Params;
}) {
  await requirePermission("projects:write");
  const { id } = await params;

  let category;
  try {
    category = await projectCategoryService.getById(id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Edit category" description={category.nameEn} />
      <ProjectCategoryForm
        mode="edit"
        initial={{
          id: category.id,
          slug: category.slug,
          nameAr: category.nameAr,
          nameEn: category.nameEn,
          descriptionAr: category.descriptionAr,
          descriptionEn: category.descriptionEn,
          sortOrder: category.sortOrder,
          published: category.published,
        }}
      />
    </div>
  );
}
