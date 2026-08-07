"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { assertLoginAllowed } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const gate = await assertLoginAllowed(email);
      if (!gate.ok) {
        setError("Too many sign-in attempts. Please wait and try again.");
        return;
      }

      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
        return;
      }

      router.push(
        callbackUrl.startsWith("/admin") ? callbackUrl : "/admin/dashboard",
      );
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-xl border border-border bg-surface/80 p-6 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur-sm sm:p-8"
    >
      <div className="space-y-2">
        <Label htmlFor="email" className="text-muted-foreground">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          placeholder="admin@northernmeteor.com"
          className="h-10 border-border bg-background/60 text-foreground placeholder:text-muted-foreground/60 focus-visible:border-gold focus-visible:ring-gold/30"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-muted-foreground">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          placeholder="••••••••"
          className="h-10 border-border bg-background/60 text-foreground placeholder:text-muted-foreground/60 focus-visible:border-gold focus-visible:ring-gold/30"
        />
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={loading}
        className={cn(
          "h-10 w-full bg-gold text-primary-foreground hover:bg-gold-light",
          "font-medium tracking-wide",
        )}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" data-icon="inline-start" />
            Signing in…
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}
