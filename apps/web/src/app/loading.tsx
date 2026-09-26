export default function Loading() {
  return (
    <main className="min-h-screen px-6 py-12 sm:px-10 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_420px] lg:items-center">
        <div className="space-y-6">
          <div className="h-7 w-32 animate-pulse rounded-full bg-muted" />
          <div className="h-24 max-w-xl animate-pulse rounded-2xl bg-muted" />
          <div className="h-16 max-w-xl animate-pulse rounded-2xl bg-muted" />
        </div>
        <div className="h-[420px] animate-pulse rounded-2xl bg-muted" />
      </div>
    </main>
  );
}
