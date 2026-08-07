"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FormActionsProps = {
  saveLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  pending?: boolean;
  disabled?: boolean;
  secondary?: ReactNode;
  className?: string;
  saveType?: "button" | "submit";
  onSave?: () => void;
};

/** Inline Save / Cancel button group for forms. */
export function FormActions({
  saveLabel = "Save",
  cancelLabel = "Cancel",
  onCancel,
  pending = false,
  disabled = false,
  secondary,
  className,
  saveType = "submit",
  onSave,
}: FormActionsProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-end gap-2 pt-2",
        className,
      )}
    >
      {secondary}
      {onCancel ? (
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>
      ) : null}
      <Button
        type={saveType}
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
  );
}
