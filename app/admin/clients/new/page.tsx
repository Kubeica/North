import { PageHeader } from "@/components/admin/PageHeader";
import { ClientForm } from "@/components/admin/forms/ClientForm";
import { requirePermission } from "@/lib/auth/session";

export const metadata = { title: "New client" };

export default async function NewClientPage() {
  await requirePermission("clients:write");

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="New client" />
      <ClientForm mode="create" />
    </div>
  );
}
