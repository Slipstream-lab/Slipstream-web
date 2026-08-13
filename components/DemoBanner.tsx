/** A prominent banner shown whenever the UI is rendering demo fixtures. */
export function DemoBanner({ message }: { message: string }) {
  return (
    <div className="rounded-lg bg-amber-500/10 px-4 py-2 text-sm text-amber-700 ring-1 ring-amber-500/30 dark:text-amber-200">
      <span className="font-semibold">Demo data.</span> {message}
    </div>
  );
}
