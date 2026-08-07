"use client";

import Link from "next/link";
import { useEffect } from "react";

type AdminErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminError({ error, reset }: AdminErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        Admin error
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        Something went wrong while loading this admin page. Your session is
        unchanged — try again or return to the dashboard.
      </p>
      {error.digest ? (
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          Digest: {error.digest}
        </p>
      ) : null}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-10 items-center rounded-md bg-gold px-5 text-sm font-medium text-primary-foreground hover:bg-gold-light"
        >
          Try again
        </button>
        <Link
          href="/admin/dashboard"
          className="inline-flex h-10 items-center rounded-md border border-border px-5 text-sm font-medium hover:bg-muted"
        >
          Dashboard
        </Link>
      </div>
    </section>
  );
}
