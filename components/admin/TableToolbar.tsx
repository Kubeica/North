"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition, type FormEvent, type ReactNode } from "react";

import { FilterBar, type FilterConfig } from "@/components/admin/FilterBar";
import { SearchBar } from "@/components/admin/SearchBar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TableToolbarProps = {
  placeholder?: string;
  filters?: FilterConfig[];
  actions?: ReactNode;
  className?: string;
  /** When false, render children only (no URL navigation form). Default true. */
  syncUrl?: boolean;
  children?: ReactNode;
};

/**
 * List toolbar: SearchBar + FilterBar + optional right-side actions.
 * By default submits to the current pathname as query params (same as SearchFilters).
 */
export function TableToolbar({
  placeholder = "Search…",
  filters = [],
  actions,
  className,
  syncUrl = true,
  children,
}: TableToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    if (!syncUrl) return;
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    const q = String(form.get("q") ?? "").trim();
    if (q) params.set("q", q);
    for (const filter of filters) {
      const value = String(form.get(filter.name) ?? "");
      if (value) params.set(filter.name, value);
    }
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  }

  const filterDefaults = filters.map((filter) => ({
    ...filter,
    defaultValue: filter.defaultValue ?? searchParams.get(filter.name) ?? "",
  }));

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "mb-4 flex flex-col gap-3 rounded-xl border border-border bg-surface/60 p-3 sm:flex-row sm:flex-wrap sm:items-end",
        className,
      )}
    >
      {children ?? (
        <>
          <SearchBar
            placeholder={placeholder}
            defaultValue={searchParams.get("q") ?? ""}
          />
          <FilterBar filters={filterDefaults} />
        </>
      )}
      {syncUrl ? (
        <Button type="submit" size="sm" disabled={pending} className="h-9">
          {pending ? "Filtering…" : "Apply"}
        </Button>
      ) : null}
      {actions ? (
        <div className="ms-auto flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </form>
  );
}
