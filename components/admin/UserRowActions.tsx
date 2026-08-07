"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, UserX } from "lucide-react";

import { deactivateUser } from "@/app/actions/users";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";

type UserRowActionsProps = {
  id: string;
  active: boolean;
  isSelf: boolean;
};

export function UserRowActions({ id, active, isSelf }: UserRowActionsProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        render={<Link href={`/admin/users/${id}/edit`} />}
      >
        <Pencil />
      </Button>
      {active && !isSelf ? (
        <ConfirmDialog
          title="Deactivate user?"
          description="They will no longer be able to sign in to the CMS."
          confirmLabel="Deactivate"
          destructive
          successMessage="User deactivated"
          onConfirm={async () => {
            const result = await deactivateUser(id);
            router.refresh();
            return result;
          }}
          trigger={
            <Button variant="ghost" size="icon-sm">
              <UserX className="text-destructive" />
            </Button>
          }
        />
      ) : null}
    </div>
  );
}
