import { notFound } from "next/navigation";

import { PageHeader } from "@/components/admin/PageHeader";
import { StatisticForm } from "@/components/admin/forms/StatisticForm";
import { requirePermission } from "@/lib/auth/session";
import { NotFoundError } from "@/src/domain/shared/errors";
import { statisticService } from "@/src/domain/statistic/service";

export const metadata = { title: "Edit statistic" };

type Params = Promise<{ id: string }>;

export default async function EditStatisticPage({ params }: { params: Params }) {
  await requirePermission("statistics:write");
  const { id } = await params;

  let statistic;
  try {
    statistic = await statisticService.getById(id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Edit statistic" description={statistic.labelEn} />
      <StatisticForm
        mode="edit"
        initial={{
          id: statistic.id,
          labelAr: statistic.labelAr,
          labelEn: statistic.labelEn,
          value: statistic.value,
          sortOrder: statistic.sortOrder,
          published: statistic.published,
        }}
      />
    </div>
  );
}
