"use client";

import { useRouter } from "next/navigation";
import { Archive, CheckCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  archiveMessage,
  deleteMessage,
  markMessageRead,
} from "@/app/actions/messages";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";

type MessageActionsProps = {
  id: string;
  status: string;
};

export function MessageActions({ id, status }: MessageActionsProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-end gap-1">
      {status === "UNREAD" ? (
        <Button
          variant="ghost"
          size="icon-sm"
          title="Mark read"
          onClick={async () => {
            try {
              const result = await markMessageRead(id);
              if (!result.ok) {
                toast.error(result.error);
                return;
              }
              toast.success(result.message ?? "Marked as read");
              router.refresh();
            } catch (error) {
              toast.error(
                error instanceof Error ? error.message : "Failed to mark read",
              );
            }
          }}
        >
          <CheckCheck />
        </Button>
      ) : null}

      {status !== "ARCHIVED" ? (
        <ConfirmDialog
          title="Archive message?"
          description="The message will move to the archived inbox."
          confirmLabel="Archive"
          successMessage="Message archived"
          onConfirm={async () => {
            const result = await archiveMessage(id);
            router.refresh();
            return result;
          }}
          trigger={
            <Button variant="ghost" size="icon-sm" title="Archive">
              <Archive />
            </Button>
          }
        />
      ) : null}

      <ConfirmDialog
        title="Delete message?"
        description="This permanently removes the contact message. This cannot be undone."
        confirmLabel="Delete"
        destructive
        successMessage="Message deleted"
        onConfirm={async () => {
          const result = await deleteMessage(id);
          router.refresh();
          return result;
        }}
        trigger={
          <Button variant="ghost" size="icon-sm" title="Delete">
            <Trash2 className="text-destructive" />
          </Button>
        }
      />
    </div>
  );
}
