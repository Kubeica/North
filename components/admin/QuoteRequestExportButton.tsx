"use client";

import { useState, useTransition } from "react";
import { Download } from "lucide-react";

import { exportQuoteRequestsCsv } from "@/app/actions/quote-requests";
import { Button } from "@/components/ui/button";

type QuoteRequestExportButtonProps = {
  q?: string;
  status?: string;
};

export function QuoteRequestExportButton({
  q,
  status,
}: QuoteRequestExportButtonProps) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await exportQuoteRequestsCsv({ q, status });
            if (!result.ok) {
              setError(result.error);
              return;
            }

            const blob = new Blob([result.data.csv], {
              type: "text/csv;charset=utf-8",
            });
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = result.data.filename;
            anchor.click();
            URL.revokeObjectURL(url);
          });
        }}
      >
        <Download className="size-4" />
        {pending ? "Exporting…" : "Export CSV"}
      </Button>
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
