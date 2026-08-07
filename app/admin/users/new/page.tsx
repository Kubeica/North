import { redirect } from "next/navigation";

import { PageHeader } from "@/components/admin/PageHeader";
import { UserForm } from "@/components/admin/forms/UserForm";
import { requireSession } from "@/lib/auth/session";
import { can } from "@/lib/permissions";

export const metadata = { title: "New user" };

export default async function NewUserPage() {
  const user = await requireSession();
  if (!can(user.role, "users:write")) redirect("/admin/dashboard");

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="New user" description="Create a CMS account." />
      <UserForm mode="create" />
    </div>
  );
}
