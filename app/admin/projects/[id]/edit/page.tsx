import { notFound } from "next/navigation";

import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectForm } from "@/components/admin/forms/ProjectForm";
import { requirePermission } from "@/lib/auth/session";
import { clientService } from "@/src/domain/client/service";
import { NotFoundError } from "@/src/domain/shared/errors";
import { projectService } from "@/src/domain/project/service";

export const metadata = { title: "Edit project" };

type Params = Promise<{ id: string }>;

function toDateInput(value: Date | null | undefined) {
  if (!value) return "";
  return value.toISOString().slice(0, 10);
}

export default async function EditProjectPage({
  params,
}: {
  params: Params;
}) {
  await requirePermission("projects:write");
  const { id } = await params;

  let project;
  try {
    const [loaded, categories, clients] = await Promise.all([
      projectService.getById(id),
      projectService.listCategories(),
      clientService.listOptions(),
    ]);
    project = { loaded, categories, clients };
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  const { loaded, categories, clients } = project;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Edit project"
        description={loaded.titleEn}
      />
      <ProjectForm
        mode="edit"
        categories={categories.map((c) => ({ id: c.id, label: c.nameEn }))}
        clients={clients.map((c) => ({ id: c.id, label: c.name }))}
        initial={{
          id: loaded.id,
          slug: loaded.slug,
          titleAr: loaded.titleAr,
          titleEn: loaded.titleEn,
          summaryAr: loaded.summaryAr,
          summaryEn: loaded.summaryEn,
          descriptionAr: loaded.descriptionAr,
          descriptionEn: loaded.descriptionEn,
          locationAr: loaded.locationAr,
          locationEn: loaded.locationEn,
          coverImageUrl: loaded.coverImageUrl,
          clientId: loaded.clientId,
          categoryId: loaded.categoryId,
          status: loaded.status,
          startDate: toDateInput(loaded.startDate),
          completionDate: toDateInput(loaded.completionDate),
          featured: loaded.featured,
          published: loaded.published,
          seoTitleAr: loaded.seoTitleAr,
          seoTitleEn: loaded.seoTitleEn,
          seoDescriptionAr: loaded.seoDescriptionAr,
          seoDescriptionEn: loaded.seoDescriptionEn,
          scopeAr: loaded.scopeAr,
          scopeEn: loaded.scopeEn,
          isDemo: loaded.isDemo,
          galleryUrls: loaded.images.map((img) => img.url).join("\n"),
        }}
      />
    </div>
  );
}
