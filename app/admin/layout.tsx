import type { ReactNode } from "react";
import { headers } from "next/headers";

import { AdminProviders } from "@/components/admin/providers";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  getRequiredPermissionForPath,
  isAdminPublicPath,
} from "@/lib/auth/route-guards";
import {
  getCurrentUser,
  requirePermission,
  requireSession,
} from "@/lib/auth/session";

export const metadata = {
  title: {
    default: "Admin | Northern Meteor",
    template: "%s | Admin · Northern Meteor",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isPublic = !pathname || isAdminPublicPath(pathname);

  if (!isPublic) {
    const permission = getRequiredPermissionForPath(pathname);
    if (permission) {
      await requirePermission(permission);
    } else {
      await requireSession();
    }
  }

  const user = await getCurrentUser();

  return (
    <AdminProviders>
      <AdminShell user={user}>{children}</AdminShell>
    </AdminProviders>
  );
}
