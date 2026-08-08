import { Suspense } from "react";

import { LoginForm } from "./login-form";

export const metadata = {
  title: "Admin Login | Northern Meteor",
  description: "Sign in to the Northern Meteor CMS.",
};

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,color-mix(in_srgb,var(--gold)_18%,transparent),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-10 text-center">
          <p className="font-heading text-3xl font-semibold tracking-[0.08em] text-gold sm:text-4xl">
            NORTHERN METEOR
          </p>
          <div className="mx-auto mt-3 h-px w-16 bg-gold/70" />
          <h1 className="mt-6 text-xl font-medium tracking-tight text-foreground sm:text-2xl">
            Construction CMS
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage projects, content, and site settings.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="h-64 animate-pulse rounded-xl border border-border bg-surface/80" />
          }
        >
          <LoginForm />
        </Suspense>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Authorized personnel only.
        </p>
      </div>
    </div>
  );
}
