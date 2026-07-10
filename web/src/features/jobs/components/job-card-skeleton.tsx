// Placeholder shown while the Server Component fetches. Mirrors JobCard's layout
// so the page doesn't shift when real data streams in.
export function JobCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="w-full">
          <div className="h-4 w-2/3 rounded bg-zinc-200" />
          <div className="mt-2 h-3 w-1/3 rounded bg-zinc-100" />
        </div>
        <div className="h-5 w-20 rounded-full bg-zinc-200" />
      </div>
      <div className="mt-5 h-2 w-full rounded-full bg-zinc-200" />
    </div>
  );
}

export function ResultsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  );
}
