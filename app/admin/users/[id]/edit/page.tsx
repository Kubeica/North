import { notFound, redirect } from "next/navigation";

import { PageHeader } from "@/components/admin/PageHeader";
import { UserForm } from "@/components/admin/forms/UserForm";
import { requireSession } from "@/lib/auth/session";
import { can } from "@/lib/permissions";
import { NotFoundError } from "@/src/domain/shared/errors";
import { userService } from "@/src/domain/user/service";

export const metadata = { title: "Edit user" };

type Params = Promise<{ id: string }>;

export default async function EditUserPage({ params }: { params: Params }) {
  const current = await requireSession();
  if (!can(current.role, "users:write")) redirect("/admin/dashboard");

  const { id } = await params;
  let user;
  try {
    user = await userService.getById(id);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Edit user" description={user.email} />
      <UserForm
        mode="edit"
        initial={{
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          active: user.active,
        }}
      />
    </div>
  );
}
