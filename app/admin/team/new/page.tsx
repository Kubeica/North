import { PageHeader } from "@/components/admin/PageHeader";
import { TeamForm } from "@/components/admin/forms/TeamForm";
import { requirePermission } from "@/lib/auth/session";

export const metadata = { title: "New team member" };

export default async function NewTeamMemberPage() {
  await requirePermission("team:write");

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="New team member" />
      <TeamForm mode="create" />
    </div>
  );
}
