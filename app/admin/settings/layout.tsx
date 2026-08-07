import type { ReactNode } from "react";

import { requirePermission } from "@/lib/auth/session";

/** ADMIN-only: System settings. */
export default async function AdminSettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requirePermission("settings:read");
  return children;
}
