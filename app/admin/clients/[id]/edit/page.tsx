import { notFound } from "next/navigation";

import { PageHeader } from "@/components/admin/PageHeader";
import { ClientForm } from "@/components/admin/forms/ClientForm";
import { requirePermission } from "@/lib/auth/session";
import { clientService } from "@/src/domain/client/service";
import { NotFoundError } from "@/src/domain/shared/errors";

export const metadata = { title: "Edit client" };

type Params = Promise<{ id: string }>;

export default async function EditClientPage({ params }: { params: Params }) {
  await requirePermission("clients:write");
  const { id } = await params;

  let client;
  try {
    client = await clientService.getById(id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Edit client" description={client.name} />
      <ClientForm
        mode="edit"
        initial={{
          id: client.id,
          name: client.name,
          logoUrl: client.logoUrl,
          websiteUrl: client.websiteUrl,
          descriptionAr: client.descriptionAr,
          descriptionEn: client.descriptionEn,
          sortOrder: client.sortOrder,
          published: client.published,
        }}
      />
    </div>
  );
}
