"use client";

import type { ReactNode } from "react";

import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import type { ActionResult } from "@/lib/admin/action";

type DeleteConfirmationDialogProps = {
  trigger: ReactNode;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => Promise<ActionResult<unknown> | void>;
  successMessage?: string;
  /** When true, wording leans toward archive rather than permanent delete. */
  archive?: boolean;
};

/** Thin destructive ConfirmDialog for archive/delete flows. */
export function DeleteConfirmationDialog({
  trigger,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  successMessage,
  archive = false,
}: DeleteConfirmationDialogProps) {
  const resolvedTitle =
    title ?? (archive ? "Archive this item?" : "Delete this item?");
  const resolvedDescription =
    description ??
    (archive
      ? "This item will be hidden from the public site. You can still find it in admin list filters."
      : "This action cannot be undone.");
  const resolvedConfirm = confirmLabel ?? (archive ? "Archive" : "Delete");
  const resolvedSuccess =
    successMessage ?? (archive ? "Archived" : "Deleted");

  return (
    <ConfirmDialog
      trigger={trigger}
      title={resolvedTitle}
      description={resolvedDescription}
      confirmLabel={resolvedConfirm}
      cancelLabel={cancelLabel}
      destructive
      onConfirm={onConfirm}
      successMessage={resolvedSuccess}
    />
  );
}
