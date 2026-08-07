"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <section className="flex min-h-dvh flex-col items-center justify-center px-6 py-24 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Something went wrong
          </h1>
          <p className="mt-4 max-w-md text-neutral-600">
            A critical error occurred. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-8 inline-flex h-11 items-center rounded-md bg-[#C9A227] px-6 text-sm font-medium text-[#12161A] hover:opacity-90"
          >
            Try again
          </button>
        </section>
      </body>
    </html>
  );
}
