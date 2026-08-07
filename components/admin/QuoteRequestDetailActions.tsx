"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  archiveQuoteRequest,
  deleteQuoteRequest,
  updateQuoteRequestNotes,
  updateQuoteRequestStatus,
} from "@/app/actions/quote-requests";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import type { QuoteRequestStatus } from "@/types";

const STATUS_OPTIONS: { value: QuoteRequestStatus; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "IN_REVIEW", label: "In review" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "WON", label: "Won" },
  { value: "LOST", label: "Lost" },
  { value: "ARCHIVED", label: "Archived" },
];

type QuoteRequestDetailActionsProps = {
  id: string;
  status: QuoteRequestStatus;
  notes: string | null;
};

export function QuoteRequestDetailActions({
  id,
  status,
  notes,
}: QuoteRequestDetailActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [notesValue, setNotesValue] = useState(notes ?? "");
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="quote-status" className="text-sm font-medium">
          Status
        </label>
        <select
          id="quote-status"
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
          defaultValue={status}
          disabled={pending}
          onChange={(event) => {
            const next = event.target.value as QuoteRequestStatus;
            startTransition(async () => {
              const result = await updateQuoteRequestStatus(id, next);
              setMessage(result.ok ? result.message ?? "Updated" : result.error);
              router.refresh();
            });
          }}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="quote-notes" className="text-sm font-medium">
          Internal notes
        </label>
        <textarea
          id="quote-notes"
          rows={6}
          value={notesValue}
          onChange={(event) => setNotesValue(event.target.value)}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
          placeholder="Private notes for the team…"
        />
        <Button
          type="button"
          disabled={pending}
          onClick={() => {
            startTransition(async () => {
              const result = await updateQuoteRequestNotes(id, notesValue);
              setMessage(result.ok ? result.message ?? "Saved" : result.error);
              router.refresh();
            });
          }}
        >
          Save notes
        </Button>
      </div>

      {message ? (
        <p className="text-xs text-muted-foreground" role="status">
          {message}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 border-t border-border pt-4">
        {status !== "ARCHIVED" ? (
          <ConfirmDialog
            title="Archive quote request?"
            description="The request will be marked as archived."
            confirmLabel="Archive"
            successMessage="Archived"
            onConfirm={async () => {
              const result = await archiveQuoteRequest(id);
              router.refresh();
              return result;
            }}
            trigger={<Button variant="outline">Archive</Button>}
          />
        ) : null}

        <ConfirmDialog
          title="Delete quote request?"
          description="This permanently removes the quote request."
          confirmLabel="Delete"
          destructive
          successMessage="Deleted"
          onConfirm={async () => {
            const result = await deleteQuoteRequest(id);
            if (result.ok) {
              router.push("/admin/quote-requests");
              router.refresh();
            }
            return result;
          }}
          trigger={<Button variant="destructive">Delete</Button>}
        />
      </div>
    </div>
  );
}
