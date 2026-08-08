import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectForm } from "@/components/admin/forms/ProjectForm";
import { requirePermission } from "@/lib/auth/session";
import { clientService } from "@/src/domain/client/service";
import { projectCategoryService } from "@/src/domain/project-category/service";

export const metadata = { title: "New project" };

export default async function NewProjectPage() {
  await requirePermission("projects:write");

  const [categories, clients] = await Promise.all([
    projectCategoryService.listOptions(),
    clientService.listOptions(),
  ]);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="New project"
        description="Create a project with bilingual content and gallery."
      />
      <ProjectForm
        mode="create"
        categories={categories.map((c) => ({ id: c.id, label: c.nameEn }))}
        clients={clients.map((c) => ({ id: c.id, label: c.name }))}
      />
    </div>
  );
}
