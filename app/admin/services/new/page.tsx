import { PageHeader } from "@/components/admin/PageHeader";
import { ServiceForm } from "@/components/admin/forms/ServiceForm";
import { requirePermission } from "@/lib/auth/session";

export const metadata = { title: "New service" };

export default async function NewServicePage() {
  await requirePermission("services:write");

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="New service" description="Add a bilingual service." />
      <ServiceForm mode="create" />
    </div>
  );
}
