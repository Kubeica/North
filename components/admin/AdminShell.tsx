"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";
import type { Role } from "@/lib/permissions";

type AdminShellProps = {
  children: ReactNode;
  user: { name: string; email: string; role: Role } | null;
};

/** Routes that render without the sidebar chrome. */
const SHELLLESS = new Set(["/admin/login"]);

export function AdminShell({ children, user }: AdminShellProps) {
  const pathname = usePathname();
  const hideShell = SHELLLESS.has(pathname) || !user;

  if (hideShell) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-dvh bg-background text-foreground">
      <Sidebar role={user.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar user={user} />
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
