export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div
      className="flex items-center gap-3 text-slate-600 dark:text-slate-400"
      role="status"
      aria-live="polite"
    >
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-sky-500 dark:border-slate-600 dark:border-t-sky-400" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

/** A skeleton block for content-shaped placeholders. */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-slate-200 dark:bg-slate-800/70 ${className}`}
      aria-hidden
    />
  );
}
