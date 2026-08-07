import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { ErrorState } from "@/components/admin/ErrorState";
import { Button } from "@/components/ui/button";
import { requireSession } from "@/lib/auth/session";

export const metadata = { title: "Unauthorized" };

export default async function AdminUnauthorizedPage() {
  await requireSession();

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center">
      <ErrorState
        icon={<ShieldAlert className="size-8 text-gold" />}
        title="Access denied"
        description="Your role does not have permission to view this area. Contact an administrator if you believe this is a mistake."
        action={
          <Button render={<Link href="/admin/dashboard" />}>
            Back to dashboard
          </Button>
        }
      />
    </div>
  );
}
