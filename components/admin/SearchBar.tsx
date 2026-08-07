"use client";

import { Search } from "lucide-react";
import type { ChangeEventHandler, InputHTMLAttributes } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  className?: string;
  inputClassName?: string;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "name" | "placeholder" | "defaultValue" | "value" | "onChange" | "className"
>;

/** Reusable search input — controlled or form-based (name + defaultValue). */
export function SearchBar({
  name = "q",
  placeholder = "Search…",
  defaultValue,
  value,
  onChange,
  className,
  inputClassName,
  ...rest
}: SearchBarProps) {
  return (
    <div className={cn("relative min-w-[200px] flex-1", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        name={name}
        placeholder={placeholder}
        defaultValue={value === undefined ? defaultValue : undefined}
        value={value}
        onChange={onChange}
        className={cn(
          "h-9 border-border bg-background/50 pl-9",
          inputClassName,
        )}
        {...rest}
      />
    </div>
  );
}
