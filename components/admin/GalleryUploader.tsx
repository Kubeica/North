"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import {
  Field,
  fieldClassName,
  textareaClassName,
} from "@/components/admin/FormSection";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type GalleryUploaderProps = {
  name?: string;
  label?: string;
  defaultValue?: string | string[];
  value?: string[];
  onChange?: (urls: string[]) => void;
  className?: string;
  /** Prefer chip list UI; set false for a simple textarea. */
  mode?: "chips" | "textarea";
};

function toList(value: string | string[] | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return value
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** List of image URLs with add/remove and reorder. */
export function GalleryUploader({
  name = "galleryUrls",
  label = "Gallery URLs",
  defaultValue,
  value,
  onChange,
  className,
  mode = "chips",
}: GalleryUploaderProps) {
  const [internal, setInternal] = useState(() => toList(defaultValue));
  const [draft, setDraft] = useState("");
  const urls = value ?? internal;

  function commit(next: string[]) {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  }

  const serialized = useMemo(() => urls.join("\n"), [urls]);

  if (mode === "textarea") {
    return (
      <div className={cn("sm:col-span-2", className)}>
        <Field label={label} name={name} full>
          <textarea
            id={name}
            name={name}
            defaultValue={serialized}
            className={textareaClassName}
            placeholder={"https://…\nhttps://…"}
            onChange={(e) => commit(toList(e.target.value))}
          />
        </Field>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3 sm:col-span-2", className)}>
      <input type="hidden" name={name} value={serialized} />
      <span className="text-xs font-medium text-muted-foreground">{label}</span>

      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="https://…"
          className={cn(fieldClassName, "flex-1")}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const next = draft.trim();
              if (!next) return;
              commit([...urls, next]);
              setDraft("");
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9"
          onClick={() => {
            const next = draft.trim();
            if (!next) return;
            commit([...urls, next]);
            setDraft("");
          }}
        >
          <Plus data-icon="inline-start" />
          Add
        </Button>
      </div>

      {urls.length === 0 ? (
        <p className="text-xs text-muted-foreground">No gallery images yet.</p>
      ) : (
        <ul className="space-y-2">
          {urls.map((url, index) => (
            <li
              key={`${url}-${index}`}
              className="flex items-center gap-2 rounded-lg border border-border bg-background/40 p-2"
            >
              <div className="size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="size-full object-cover" />
              </div>
              <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
                {url}
              </span>
              <div className="flex shrink-0 items-center gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={index === 0}
                  onClick={() => {
                    const next = [...urls];
                    [next[index - 1], next[index]] = [
                      next[index],
                      next[index - 1],
                    ];
                    commit(next);
                  }}
                >
                  <ArrowUp />
                  <span className="sr-only">Move up</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={index === urls.length - 1}
                  onClick={() => {
                    const next = [...urls];
                    [next[index], next[index + 1]] = [
                      next[index + 1],
                      next[index],
                    ];
                    commit(next);
                  }}
                >
                  <ArrowDown />
                  <span className="sr-only">Move down</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => commit(urls.filter((_, i) => i !== index))}
                >
                  <Trash2 className="text-destructive" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
