import { notFound } from "next/navigation";

import { PageHeader } from "@/components/admin/PageHeader";
import { MilestoneForm } from "@/components/admin/forms/MilestoneForm";
import { requirePermission } from "@/lib/auth/session";
import { NotFoundError } from "@/src/domain/shared/errors";
import { milestoneService } from "@/src/domain/milestone/service";

export const metadata = { title: "Edit milestone" };

type Params = Promise<{ id: string }>;

export default async function EditMilestonePage({
  params,
}: {
  params: Params;
}) {
  await requirePermission("milestones:write");
  const { id } = await params;

  let milestone;
  try {
    milestone = await milestoneService.getById(id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Edit milestone"
        description={`${milestone.year} — ${milestone.titleEn}`}
      />
      <MilestoneForm
        mode="edit"
        initial={{
          id: milestone.id,
          year: milestone.year,
          titleAr: milestone.titleAr,
          titleEn: milestone.titleEn,
          descriptionAr: milestone.descriptionAr,
          descriptionEn: milestone.descriptionEn,
          sortOrder: milestone.sortOrder,
          published: milestone.published,
        }}
      />
    </div>
  );
}
