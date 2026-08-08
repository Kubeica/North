import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectCategoryForm } from "@/components/admin/forms/ProjectCategoryForm";
import { requirePermission } from "@/lib/auth/session";

export const metadata = { title: "New project category" };

export default async function NewProjectCategoryPage() {
  await requirePermission("projects:write");

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="New project category" />
      <ProjectCategoryForm mode="create" />
    </div>
  );
}
