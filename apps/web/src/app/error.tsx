"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <section className="max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-xl shadow-slate-950/5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-destructive">
          Something went wrong
        </p>
        <h1 className="mt-3 text-2xl font-semibold">
          The page needs a fresh start.
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Try rendering this page again. If the API is unavailable, check its
          URL in your web environment.
        </p>
        <Button className="mt-6" onClick={reset}>
          Try again
        </Button>
      </section>
    </main>
  );
}
