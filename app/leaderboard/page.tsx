import Link from "next/link";
import { BarMeter, DemoBanner, EmptyState, GradeBadge } from "@/components";
import { ErrorState } from "@/components/states/ErrorState";
import { api, isApiConfigured, type LeaderboardEntry } from "@/lib/api";
import { DEMO_BANNER, DEMO_LEADERBOARD } from "@/lib/fixtures";
import { formatRatio } from "@/lib/format";

async function load(): Promise<{ rows: LeaderboardEntry[]; isDemo: boolean }> {
  if (!isApiConfigured()) return { rows: DEMO_LEADERBOARD, isDemo: true };
  return { rows: await api.getLeaderboard(), isDemo: false };
}

export default async function LeaderboardPage() {
  let rows: LeaderboardEntry[];
  let isDemo = false;
  try {
    ({ rows, isDemo } = await load());
  } catch (e) {
    return (
      <ErrorState
        message={`Could not load leaderboard: ${(e as Error).message}`}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {isDemo && <DemoBanner message={DEMO_BANNER} />}
      <h1 className="text-2xl font-bold text-slate-100">Leaderboard</h1>
      <p className="text-sm text-slate-400">
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
          <div className="overflow-x-auto rounded-lg ring-1 ring-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/60 text-slate-300">
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
                    className="border-t border-slate-800/70"
                  >
                    <td className="px-3 py-2 text-slate-400">{r.rank}</td>
                    <td className="px-3 py-2">
                      <Link
                        href={`/contract/${encodeURIComponent(r.contractId)}`}
                        className="text-sky-400 hover:text-sky-300"
                      >
                        {r.name}
                      </Link>
                    </td>
                    <td className="px-3 py-2 text-right text-slate-300">
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
