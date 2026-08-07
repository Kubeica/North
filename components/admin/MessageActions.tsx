"use client";

import { useRouter } from "next/navigation";
import { Archive, CheckCheck, Trash2 } from "lucide-react";

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
            await markMessageRead(id);
            router.refresh();
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
