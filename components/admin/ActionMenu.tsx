"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, Copy, Eye, MoreHorizontal, Pencil } from "lucide-react";
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

type ActionMenuProps = {
  viewHref?: string;
  editHref?: string;
  onView?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => Promise<ActionResult<{ id: string }> | void> | void;
  onArchive?: () => Promise<ActionResult<unknown> | void>;
  archiveLabel?: string;
  duplicateEditPath?: (id: string) => string;
};

/** Dropdown of View / Edit / Duplicate / Archive actions. */
export function ActionMenu({
  viewHref,
  editHref,
  onView,
  onEdit,
  onDuplicate,
  onArchive,
  archiveLabel = "Archive",
  duplicateEditPath,
}: ActionMenuProps) {
  const router = useRouter();
  const hasAny = viewHref || editHref || onView || onEdit || onDuplicate || onArchive;
  if (!hasAny) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <MoreHorizontal />
        <span className="sr-only">Actions</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {viewHref ? (
          <DropdownMenuItem render={<Link href={viewHref} target="_blank" />}>
            <Eye className="size-4" />
            View
          </DropdownMenuItem>
        ) : onView ? (
          <DropdownMenuItem onClick={onView}>
            <Eye className="size-4" />
            View
          </DropdownMenuItem>
        ) : null}

        {editHref ? (
          <DropdownMenuItem render={<Link href={editHref} />}>
            <Pencil className="size-4" />
            Edit
          </DropdownMenuItem>
        ) : onEdit ? (
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="size-4" />
            Edit
          </DropdownMenuItem>
        ) : null}

        {onDuplicate ? (
          <DropdownMenuItem
            onClick={async () => {
              const result = await onDuplicate();
              if (result && !result.ok) {
                toast.error(result.error);
                return;
              }
              toast.success(
                (result && "message" in result && result.message) ||
                  "Duplicated",
              );
              if (result && result.ok && result.data?.id && duplicateEditPath) {
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
  );
}
