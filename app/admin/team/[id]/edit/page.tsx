import { notFound } from "next/navigation";

import { PageHeader } from "@/components/admin/PageHeader";
import { TeamForm } from "@/components/admin/forms/TeamForm";
import { requirePermission } from "@/lib/auth/session";
import { NotFoundError } from "@/src/domain/shared/errors";
import { teamService } from "@/src/domain/team/service";

export const metadata = { title: "Edit team member" };

type Params = Promise<{ id: string }>;

export default async function EditTeamMemberPage({
  params,
}: {
  params: Params;
}) {
  await requirePermission("team:write");
  const { id } = await params;

  let member;
  try {
    member = await teamService.getById(id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Edit team member" description={member.nameEn} />
      <TeamForm
        mode="edit"
        initial={{
          id: member.id,
          nameAr: member.nameAr,
          nameEn: member.nameEn,
          positionAr: member.positionAr,
          positionEn: member.positionEn,
          bioAr: member.bioAr,
          bioEn: member.bioEn,
          imageUrl: member.imageUrl,
          linkedin: member.linkedin,
          email: member.email,
          sortOrder: member.sortOrder,
          published: member.published,
          isDemo: member.isDemo,
        }}
      />
    </div>
  );
}
