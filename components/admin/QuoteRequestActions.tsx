"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, Eye, Trash2 } from "lucide-react";

import {
  archiveQuoteRequest,
  deleteQuoteRequest,
} from "@/app/actions/quote-requests";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";

type QuoteRequestActionsProps = {
  id: string;
  status: string;
};

export function QuoteRequestActions({ id, status }: QuoteRequestActionsProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={`/admin/quote-requests/${id}`}
        title="View"
        className="inline-flex size-7 items-center justify-center rounded-lg text-foreground hover:bg-muted"
      >
        <Eye className="size-4" />
      </Link>

      {status !== "ARCHIVED" ? (
        <ConfirmDialog
          title="Archive quote request?"
          description="The request will be marked as archived."
          confirmLabel="Archive"
          successMessage="Quote request archived"
          onConfirm={async () => {
            const result = await archiveQuoteRequest(id);
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
        title="Delete quote request?"
        description="This permanently removes the quote request. This cannot be undone."
        confirmLabel="Delete"
        destructive
        successMessage="Quote request deleted"
        onConfirm={async () => {
          const result = await deleteQuoteRequest(id);
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
