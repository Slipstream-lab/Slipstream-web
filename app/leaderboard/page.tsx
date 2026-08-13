import Link from "next/link";
import { BarMeter, DemoBanner, EmptyState, GradeBadge } from "@/components";
import { loadLeaderboard } from "@/lib/data";
import { DEMO_BANNER } from "@/lib/fixtures";
import { formatRatio } from "@/lib/format";

// The leaderboard reflects live analysis results, so render on demand rather
// than prerendering at build time (which would also fetch during the build).
export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  // Errors propagate to the route-level error boundary (error.tsx).
  const { data: rows, isDemo } = await loadLeaderboard();

  return (
    <div className="flex flex-col gap-6">
      {isDemo && <DemoBanner message={DEMO_BANNER} />}
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Leaderboard
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Contracts ranked by contention score (higher is better parallelism).
      </p>

      {rows.length === 0 ? (
        <EmptyState title="No contracts analyzed yet" />
      ) : (
        <>
          <BarMeter
            title="Contention score by contract"
            max={100}
            data={rows.map((r) => ({
              label: r.name,
              value: r.score,
              caption: `${r.score}`,
            }))}
          />
          <div className="overflow-x-auto rounded-lg ring-1 ring-slate-200 dark:ring-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">#</th>
                  <th className="px-3 py-2 text-left font-medium">Contract</th>
                  <th className="px-3 py-2 text-right font-medium">
                    Parallelism
                  </th>
                  <th className="px-3 py-2 text-right font-medium">Grade</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.contractId}
                    className="border-t border-slate-200/70 dark:border-slate-800/70"
                  >
                    <td className="px-3 py-2 text-slate-500 dark:text-slate-400">
                      {r.rank}
                    </td>
                    <td className="px-3 py-2">
                      <Link
                        href={`/contract/${encodeURIComponent(r.contractId)}`}
                        className="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                      >
                        {r.name}
                      </Link>
                    </td>
                    <td className="px-3 py-2 text-right text-slate-700 dark:text-slate-300">
                      {formatRatio(r.parallelism)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex justify-end">
                        <GradeBadge score={r.score} size="sm" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
