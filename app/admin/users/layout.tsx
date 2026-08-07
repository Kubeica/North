import type { ReactNode } from "react";

import { requirePermission } from "@/lib/auth/session";

/** ADMIN-only: Users management. */
export default async function AdminUsersLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requirePermission("users:read");
  return children;
}
