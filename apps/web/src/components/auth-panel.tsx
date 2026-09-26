"use client";

import { type FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

type AuthMode = "sign-in" | "sign-up";

function getErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "message" in error) {
    const message = error.message;

    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }

  return fallback;
}

export function AuthPanel() {
  const {
    data: session,
    error: sessionError,
    isPending,
    refetch,
  } = authClient.useSession();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setNotice(null);
    setIsSubmitting(true);

    try {
      if (mode === "sign-in") {
        const result = await authClient.signIn.email({ email, password });

        if (result.error) {
          setFormError(getErrorMessage(result.error, "Unable to sign in."));
          return;
        }
      } else {
        const result = await authClient.signUp.email({
          name: name.trim() || email.split("@")[0],
          email,
          password,
        });

        if (result.error) {
          setFormError(
            getErrorMessage(result.error, "Unable to create account."),
          );
          return;
        }
      }

      setNotice(
        mode === "sign-in" ? "You are signed in." : "Your account is ready.",
      );
      setPassword("");
      await refetch();
    } catch (error) {
      setFormError(
        getErrorMessage(error, "The API could not complete this request."),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignOut() {
    setFormError(null);
    setNotice(null);
    setIsSubmitting(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        setFormError(getErrorMessage(result.error, "Unable to sign out."));
        return;
      }

      setNotice("You are signed out.");
      await refetch();
    } catch (error) {
      setFormError(getErrorMessage(error, "The API could not sign you out."));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isPending) {
    return (
      <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-xl shadow-slate-950/5">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="size-2 animate-pulse rounded-full bg-primary" />
          Checking your session…
        </div>
      </section>
    );
  }

  if (session) {
    return (
      <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-xl shadow-slate-950/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Session active
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Welcome back.
            </h2>
          </div>
          <span className="mt-1 size-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/15" />
        </div>
        <div className="mt-6 rounded-xl bg-muted/60 p-4">
          <p className="font-medium text-foreground">{session.user.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {session.user.email}
          </p>
        </div>
        {formError ? (
          <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {formError}
          </p>
        ) : null}
        {notice ? (
          <p className="mt-4 text-sm text-emerald-700">{notice}</p>
        ) : null}
        <Button
          className="mt-6 w-full"
          disabled={isSubmitting}
          onClick={handleSignOut}
          variant="outline"
        >
          {isSubmitting ? "Signing out…" : "Sign out"}
        </Button>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-xl shadow-slate-950/5 sm:p-8">
      <div
        className="flex rounded-lg bg-muted p-1"
        role="tablist"
        aria-label="Authentication mode"
      >
        <button
          aria-selected={mode === "sign-in"}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            mode === "sign-in"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => {
            setMode("sign-in");
            setFormError(null);
            setNotice(null);
          }}
          role="tab"
          type="button"
        >
          Sign in
        </button>
        <button
          aria-selected={mode === "sign-up"}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            mode === "sign-up"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => {
            setMode("sign-up");
            setFormError(null);
            setNotice(null);
          }}
          role="tab"
          type="button"
        >
          Create account
        </button>
      </div>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Better Auth
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          {mode === "sign-in" ? "Sign in to continue" : "Start with an account"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {mode === "sign-in"
            ? "Your session is managed by the Hono API."
            : "Create an email and password account through the API."}
        </p>
      </div>

      {sessionError ? (
        <p className="mt-5 rounded-lg border border-amber-300/60 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Session status is unavailable. Check that the API is running at the
          configured URL.
        </p>
      ) : null}
      {formError ? (
        <p className="mt-5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {formError}
        </p>
      ) : null}
      {notice ? (
        <p className="mt-5 text-sm text-emerald-700">{notice}</p>
      ) : null}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {mode === "sign-up" ? (
          <label className="block space-y-2 text-sm font-medium" htmlFor="name">
            Name
            <input
              autoComplete="name"
              className="flex h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              id="name"
              onChange={(event) => setName(event.target.value)}
              placeholder="Ada Lovelace"
              value={name}
            />
          </label>
        ) : null}
        <label className="block space-y-2 text-sm font-medium" htmlFor="email">
          Email
          <input
            autoComplete="email"
            className="flex h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            id="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            type="email"
            value={email}
          />
        </label>
        <label
          className="block space-y-2 text-sm font-medium"
          htmlFor="password"
        >
          Password
          <input
            autoComplete={
              mode === "sign-in" ? "current-password" : "new-password"
            }
            className="flex h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            id="password"
            minLength={8}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            required
            type="password"
            value={password}
          />
        </label>
        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting
            ? mode === "sign-in"
              ? "Signing in…"
              : "Creating account…"
            : mode === "sign-in"
              ? "Sign in"
              : "Create account"}
        </Button>
      </form>
    </section>
  );
}
