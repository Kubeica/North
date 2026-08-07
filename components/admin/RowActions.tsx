"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Eye, MoreHorizontal, Pencil, Archive } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ActionResult } from "@/lib/admin/action";

type RowActionsProps = {
  viewHref?: string;
  editHref: string;
  onArchive?: () => Promise<ActionResult<unknown>>;
  onDuplicate?: () => Promise<ActionResult<{ id: string }>>;
  archiveLabel?: string;
  duplicateEditPath?: (id: string) => string;
};

export function RowActions({
  viewHref,
  editHref,
  onArchive,
  onDuplicate,
  archiveLabel = "Archive",
  duplicateEditPath,
}: RowActionsProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-end gap-1">
      {viewHref ? (
        <Button
          variant="ghost"
          size="icon-sm"
          render={<Link href={viewHref} target="_blank" />}
        >
          <Eye />
          <span className="sr-only">View</span>
        </Button>
      ) : null}
      <Button variant="ghost" size="icon-sm" render={<Link href={editHref} />}>
        <Pencil />
        <span className="sr-only">Edit</span>
      </Button>

      {(onDuplicate || onArchive) && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon-sm" />}
          >
            <MoreHorizontal />
            <span className="sr-only">More</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-40">
            {onDuplicate ? (
              <DropdownMenuItem
                onClick={async () => {
                  const result = await onDuplicate();
                  if (!result.ok) {
                    toast.error(result.error);
                    return;
                  }
                  toast.success(result.message ?? "Duplicated");
                  if (duplicateEditPath) {
                    router.push(duplicateEditPath(result.data.id));
                  }
                  router.refresh();
                }}
              >
                <Copy className="size-4" />
                Duplicate
              </DropdownMenuItem>
            ) : null}
            {onArchive ? (
              <ConfirmDialog
                title={`${archiveLabel}?`}
                description="This item will be hidden from the public site. You can still find it in the admin list filters."
                confirmLabel={archiveLabel}
                destructive
                successMessage={`${archiveLabel}d`}
                onConfirm={async () => {
                  const result = await onArchive();
                  router.refresh();
                  return result;
                }}
                trigger={
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-destructive hover:bg-muted"
                  >
                    <Archive className="size-4" />
                    {archiveLabel}
                  </button>
                }
              />
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
