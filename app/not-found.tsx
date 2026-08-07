import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/ar"
          className="inline-flex h-11 items-center rounded-md bg-gold px-6 text-sm font-medium text-primary-foreground hover:bg-gold-light"
        >
          العربية
        </Link>
        <Link
          href="/en"
          className="inline-flex h-11 items-center rounded-md border border-border px-6 text-sm font-medium hover:bg-muted"
        >
          English
        </Link>
      </div>
    </section>
  );
}
