"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type SubmitButtonProps = {
  label?: string;
  pendingLabel?: string;
};

export function SubmitButton({
  label = "Save",
  pendingLabel = "Saving…",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="min-w-28 bg-gold text-primary-foreground hover:bg-gold-light">
      {pending ? (
        <>
          <Loader2 className="animate-spin" data-icon="inline-start" />
          {pendingLabel}
        </>
      ) : (
        label
      )}
    </Button>
  );
}
