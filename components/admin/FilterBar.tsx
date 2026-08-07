"use client";

import type { ChangeEventHandler } from "react";

import { cn } from "@/lib/utils";

export type FilterOption = { value: string; label: string };

export type FilterConfig = {
  name: string;
  label: string;
  options: FilterOption[];
  allLabel?: string;
  defaultValue?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
};

type FilterBarProps = {
  filters: FilterConfig[];
  className?: string;
};

/** Select filters for list toolbars (form-based or controlled). */
export function FilterBar({ filters, className }: FilterBarProps) {
  if (!filters.length) return null;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end",
        className,
      )}
    >
      {filters.map((filter) => (
        <label
          key={filter.name}
          className="flex min-w-[140px] flex-col gap-1"
        >
          <span className="text-xs text-muted-foreground">{filter.label}</span>
          <select
            name={filter.name}
            defaultValue={
              filter.value === undefined ? (filter.defaultValue ?? "") : undefined
            }
            value={filter.value}
            onChange={filter.onChange}
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
    </div>
  );
}
