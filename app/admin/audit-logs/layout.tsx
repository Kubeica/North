import type { ReactNode } from "react";

import { requirePermission } from "@/lib/auth/session";

/** ADMIN-only: Audit logs. */
export default async function AdminAuditLogsLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requirePermission("audit:read");
  return children;
}
