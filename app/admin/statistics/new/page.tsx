import { PageHeader } from "@/components/admin/PageHeader";
import { StatisticForm } from "@/components/admin/forms/StatisticForm";
import { requirePermission } from "@/lib/auth/session";

export const metadata = { title: "New statistic" };

export default async function NewStatisticPage() {
  await requirePermission("statistics:write");

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="New statistic"
        description="Keep unpublished until the value is real."
      />
      <StatisticForm mode="create" />
    </div>
  );
}
