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

/** Server Action reference — pass the action itself, never a Server Component closure. */
type IdMutation = (id: string) => Promise<ActionResult<{ id: string } | unknown>>;
type DuplicateMutation = (id: string) => Promise<ActionResult<{ id: string }>>;

type ActionMenuProps = {
  id: string;
  viewHref?: string;
  editHref?: string;
  /** Pass a `"use server"` action, e.g. `duplicateProject`. */
  duplicateAction?: DuplicateMutation;
  /** Pass a `"use server"` action, e.g. `archiveProject`. */
  archiveAction?: IdMutation;
  archiveLabel?: string;
  /** Path template with `{id}`, e.g. `/admin/projects/{id}/edit`. */
  duplicateEditHrefTemplate?: string;
};

function resolveTemplate(template: string, id: string): string {
  return template.replaceAll("{id}", id);
}

/** Dropdown of View / Edit / Duplicate / Archive. Props must be serializable + Server Actions. */
export function ActionMenu({
  id,
  viewHref,
  editHref,
  duplicateAction,
  archiveAction,
  archiveLabel = "Archive",
  duplicateEditHrefTemplate,
}: ActionMenuProps) {
  const router = useRouter();
  const hasAny = viewHref || editHref || duplicateAction || archiveAction;
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
        ) : null}

        {editHref ? (
          <DropdownMenuItem render={<Link href={editHref} />}>
            <Pencil className="size-4" />
            Edit
          </DropdownMenuItem>
        ) : null}

        {duplicateAction ? (
          <DropdownMenuItem
            onClick={async () => {
              const result = await duplicateAction(id);
              if (!result.ok) {
                toast.error(result.error);
                return;
              }
              toast.success(result.message ?? "Duplicated");
              const newId =
                result.data &&
                typeof result.data === "object" &&
                "id" in result.data &&
                typeof result.data.id === "string"
                  ? result.data.id
                  : null;
              if (newId && duplicateEditHrefTemplate) {
                router.push(resolveTemplate(duplicateEditHrefTemplate, newId));
              }
              router.refresh();
            }}
          >
            <Copy className="size-4" />
            Duplicate
          </DropdownMenuItem>
        ) : null}

        {archiveAction ? (
          <ConfirmDialog
            title={`${archiveLabel}?`}
            description="This item will be hidden from the public site. You can still find it in the admin list filters."
            confirmLabel={archiveLabel}
            destructive
            successMessage={`${archiveLabel}d`}
            onConfirm={async () => {
              const result = await archiveAction(id);
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
