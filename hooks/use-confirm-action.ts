"use client";

import { useCallback, useState, useTransition } from "react";
import { toast } from "sonner";

import type { ActionResult } from "@/lib/admin/action";

type UseConfirmActionOptions = {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
};

/**
 * Small helper for destructive / confirm flows driven by transitions.
 * Pair with ConfirmDialog / ConfirmActionDialog `onConfirm`.
 */
export function useConfirmAction(options: UseConfirmActionOptions = {}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const run = useCallback(
    (action: () => Promise<ActionResult<unknown> | void>) => {
      startTransition(async () => {
        try {
          const result = await action();
          if (result && !result.ok) {
            toast.error(result.error);
            return;
          }
          toast.success(
            options.successMessage ??
              (result && "message" in result && result.message
                ? result.message
                : "Done"),
          );
          setOpen(false);
          options.onSuccess?.();
        } catch {
          toast.error(options.errorMessage ?? "Something went wrong.");
        }
      });
    },
    [options],
  );

  return {
    open,
    setOpen,
    pending,
    run,
    startTransition,
  };
}
