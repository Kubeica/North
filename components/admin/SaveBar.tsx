"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SaveBarProps = {
  onSave?: () => void;
  onCancel?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  pending?: boolean;
  disabled?: boolean;
  secondary?: ReactNode;
  className?: string;
  /** Use type="submit" for native form Save (default). */
  saveType?: "button" | "submit";
  form?: string;
};

/** Sticky bottom bar with Save + Cancel / secondary actions. */
export function SaveBar({
  onSave,
  onCancel,
  saveLabel = "Save",
  cancelLabel = "Cancel",
  pending = false,
  disabled = false,
  secondary,
  className,
  saveType = "submit",
  form,
}: SaveBarProps) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-20 -mx-4 mt-6 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur supports-backdrop-filter:bg-surface/80 sm:-mx-6 sm:px-6",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-end gap-2">
        {secondary}
        {onCancel ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
        ) : null}
        <Button
          type={saveType}
          form={form}
          size="sm"
          disabled={pending || disabled}
          onClick={saveType === "button" ? onSave : undefined}
          className="min-w-28 bg-gold text-primary-foreground hover:bg-gold-light"
        >
          {pending ? (
            <>
              <Loader2 className="animate-spin" data-icon="inline-start" />
              Saving…
            </>
          ) : (
            saveLabel
          )}
        </Button>
      </div>
    </div>
  );
}
