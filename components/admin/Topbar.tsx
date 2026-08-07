"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { AdminNav } from "@/components/admin/AdminNav";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Role } from "@/lib/permissions";

type TopbarProps = {
  user: { name: string; email: string; role: Role };
  title?: string;
};

export function Topbar({ user, title }: TopbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-md sm:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon-sm" className="lg:hidden" />
          }
        >
          <Menu className="size-4" />
          <span className="sr-only">Open menu</span>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-72 border-sidebar-border bg-sidebar p-0"
        >
          <SheetHeader className="border-b border-sidebar-border px-4 py-3 text-left">
            <SheetTitle className="font-heading text-sm tracking-[0.12em] text-gold">
              NORTHERN METEOR
            </SheetTitle>
          </SheetHeader>
          <div className="py-3">
            <AdminNav role={user.role} onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="min-w-0 flex-1">
        {title ? (
          <p className="truncate text-sm font-medium text-foreground">
            {title}
          </p>
        ) : (
          <Link
            href="/admin/dashboard"
            className="font-heading text-sm font-semibold tracking-[0.1em] text-gold lg:hidden"
          >
            NORTHERN METEOR
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden text-right sm:block">
          <p className="max-w-[160px] truncate text-sm text-foreground">
            {user.name}
          </p>
          <p className="max-w-[160px] truncate text-[11px] text-muted-foreground">
            {user.role}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          <LogOut data-icon="inline-start" />
          Sign out
        </Button>
      </div>
    </header>
  );
}
