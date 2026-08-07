"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition, type FormEvent } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FilterOption = { value: string; label: string };

type SearchFiltersProps = {
  placeholder?: string;
  filters?: {
    name: string;
    label: string;
    options: FilterOption[];
    allLabel?: string;
  }[];
  className?: string;
};

export function SearchFilters({
  placeholder = "Search…",
  filters = [],
  className,
}: SearchFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
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

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "mb-4 flex flex-col gap-3 rounded-xl border border-border bg-surface/60 p-3 sm:flex-row sm:flex-wrap sm:items-end",
        className,
      )}
    >
      <div className="relative min-w-[200px] flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="q"
          defaultValue={searchParams.get("q") ?? ""}
          placeholder={placeholder}
          className="h-9 border-border bg-background/50 pl-9"
        />
      </div>
      {filters.map((filter) => (
        <label key={filter.name} className="flex min-w-[140px] flex-col gap-1">
          <span className="text-xs text-muted-foreground">{filter.label}</span>
          <select
            name={filter.name}
            defaultValue={searchParams.get(filter.name) ?? ""}
            className="h-9 rounded-lg border border-border bg-background/50 px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">{filter.allLabel ?? "All"}</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      ))}
      <Button type="submit" size="sm" disabled={pending} className="h-9">
        {pending ? "Filtering…" : "Apply"}
      </Button>
    </form>
  );
}
