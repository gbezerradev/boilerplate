import { AuthPanel } from "@/components/auth-panel";

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-12 sm:px-10 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_420px] lg:items-center">
        <section className="max-w-2xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <span className="size-1.5 rounded-full bg-primary" />
            Next.js + Hono
          </div>
          <h1 className="text-5xl font-semibold tracking-[-0.04em] text-foreground sm:text-7xl">
            A calm place to start.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            This App Router frontend is wired to the API&apos;s Better Auth
            instance, so you can sign in, create an account, and inspect a live
            session from one small surface.
          </p>
          <div className="mt-10 grid max-w-xl gap-4 text-sm text-muted-foreground sm:grid-cols-3">
            <div className="border-l-2 border-primary/30 pl-3">
              <p className="font-semibold text-foreground">Typed</p>
              <p className="mt-1">TypeScript throughout</p>
            </div>
            <div className="border-l-2 border-primary/30 pl-3">
              <p className="font-semibold text-foreground">Composable</p>
              <p className="mt-1">shadcn-style primitives</p>
            </div>
            <div className="border-l-2 border-primary/30 pl-3">
              <p className="font-semibold text-foreground">Ready</p>
              <p className="mt-1">No database in the web app</p>
            </div>
          </div>
        </section>
        <AuthPanel />
      </div>
    </main>
  );
}
