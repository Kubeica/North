import { PageHeader } from "@/components/admin/PageHeader";
import { MilestoneForm } from "@/components/admin/forms/MilestoneForm";
import { requirePermission } from "@/lib/auth/session";

export const metadata = { title: "New milestone" };

export default async function NewMilestonePage() {
  await requirePermission("milestones:write");

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="New milestone" />
      <MilestoneForm mode="create" />
    </div>
  );
}
