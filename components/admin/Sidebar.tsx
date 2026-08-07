"use client";

import Link from "next/link";

import { AdminNav } from "@/components/admin/AdminNav";
import type { Role } from "@/lib/permissions";
import { cn } from "@/lib/utils";

type SidebarProps = {
  role: Role;
  className?: string;
};

export function Sidebar({ role, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex",
        className,
      )}
    >
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <Link href="/admin/dashboard" className="min-w-0">
          <p className="truncate font-heading text-sm font-semibold tracking-[0.12em] text-gold">
            NORTHERN METEOR
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            Construction CMS
          </p>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-3">
        <AdminNav role={role} />
      </div>
    </aside>
  );
}
