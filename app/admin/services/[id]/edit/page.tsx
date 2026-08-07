import { notFound } from "next/navigation";

import { PageHeader } from "@/components/admin/PageHeader";
import { ServiceForm } from "@/components/admin/forms/ServiceForm";
import { requirePermission } from "@/lib/auth/session";
import { NotFoundError } from "@/src/domain/shared/errors";
import { serviceService } from "@/src/domain/service/service";

export const metadata = { title: "Edit service" };

type Params = Promise<{ id: string }>;

export default async function EditServicePage({
  params,
}: {
  params: Params;
}) {
  await requirePermission("services:write");
  const { id } = await params;

  let service;
  try {
    service = await serviceService.getById(id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Edit service" description={service.nameEn} />
      <ServiceForm
        mode="edit"
        initial={{
          id: service.id,
          slug: service.slug,
          nameAr: service.nameAr,
          nameEn: service.nameEn,
          descriptionAr: service.descriptionAr,
          descriptionEn: service.descriptionEn,
          icon: service.icon,
          imageUrl: service.imageUrl,
          sortOrder: service.sortOrder,
          published: service.published,
          isDemo: service.isDemo,
        }}
      />
    </div>
  );
}
