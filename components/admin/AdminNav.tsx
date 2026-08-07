"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  Building2,
  Mail,
  FileText,
  ImageIcon,
  UsersRound,
  Milestone,
  UserCog,
  Settings,
  ScrollText,
  type LucideIcon,
} from "lucide-react";

import { can, type Role } from "@/lib/permissions";
import { cn } from "@/lib/utils";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  permission?: Parameters<typeof can>[1];
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/admin/projects",
    label: "Projects",
    icon: FolderKanban,
    permission: "projects:read",
  },
  {
    href: "/admin/services",
    label: "Services",
    icon: Wrench,
    permission: "services:read",
  },
  {
    href: "/admin/clients",
    label: "Clients",
    icon: Building2,
    permission: "clients:read",
  },
  {
    href: "/admin/messages",
    label: "Messages",
    icon: Mail,
    permission: "messages:read",
  },
  {
    href: "/admin/quote-requests",
    label: "Quote Requests",
    icon: FileText,
    permission: "quotes:read",
  },
  {
    href: "/admin/media",
    label: "Media",
    icon: ImageIcon,
    permission: "media:read",
  },
  {
    href: "/admin/team",
    label: "Team",
    icon: UsersRound,
    permission: "team:read",
  },
  {
    href: "/admin/milestones",
    label: "Milestones",
    icon: Milestone,
    permission: "milestones:read",
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: UserCog,
    permission: "users:read",
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
    permission: "settings:read",
  },
  {
    href: "/admin/audit-logs",
    label: "Audit Logs",
    icon: ScrollText,
    permission: "audit:read",
  },
];

export function getVisibleNavItems(role: Role): AdminNavItem[] {
  return ADMIN_NAV_ITEMS.filter(
    (item) => !item.permission || can(role, item.permission),
  );
}

type AdminNavProps = {
  role: Role;
  onNavigate?: () => void;
  className?: string;
};

export function AdminNav({ role, onNavigate, className }: AdminNavProps) {
  const pathname = usePathname();
  const items = getVisibleNavItems(role);

  return (
    <nav className={cn("flex flex-col gap-0.5 px-2", className)}>
      {items.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-gold/15 font-medium text-gold"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
