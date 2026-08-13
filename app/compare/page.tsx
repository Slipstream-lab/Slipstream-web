import { BarMeter, CompareForm, DemoBanner } from "@/components";
import { isApiConfigured } from "@/lib/api";
import { DEMO_BANNER, DEMO_CONTRACT, DEMO_LEADERBOARD } from "@/lib/fixtures";

/**
 * Comparison page. When the API is configured it renders the live
 * `CompareForm` (which calls `api.compare(left, right)` and shows real
 * summary/per-function deltas). Otherwise it renders a clearly-labelled demo
 * comparison of the naive contract against the ecosystem leader — no fabricated
 * deltas are presented as real.
 */
export default function ComparePage() {
  const live = isApiConfigured();
  const left = DEMO_CONTRACT;
  const right = DEMO_LEADERBOARD[0];

  return (
    <div className="flex flex-col gap-6">
      {!live && <DemoBanner message={DEMO_BANNER} />}
      <h1 className="text-2xl font-bold text-slate-100">Compare</h1>
      <p className="text-sm text-slate-400">
        Diff a naive implementation against an optimized one. Lower contention
        and fewer detector findings on the right indicate an improvement.
      </p>

      {live ? (
        <CompareForm />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
              <div className="text-xs text-slate-500">Left (baseline)</div>
              <div className="text-lg font-semibold text-slate-100">
                {left.name}
              </div>
              <div className="mt-1 text-sm text-slate-400">
                score {left.grade?.score ?? "—"} · parallelism{" "}
                {left.profile?.parallelism ?? "—"}
              </div>
            </div>
            <div className="rounded-xl bg-slate-900/50 p-4 ring-1 ring-slate-800">
              <div className="text-xs text-slate-500">Right (candidate)</div>
              <div className="text-lg font-semibold text-slate-100">
                {right.name}
              </div>
              <div className="mt-1 text-sm text-slate-400">
                score {right.score} · parallelism {right.parallelism}
              </div>
            </div>
          </div>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-100">
              Score comparison
            </h2>
            <BarMeter
              title="Contention score, left vs right"
              max={100}
              data={[
                { label: left.name, value: left.grade?.score ?? 0 },
                { label: right.name, value: right.score },
              ]}
            />
          </section>

          <p className="text-xs text-slate-600">
            Live deltas (detector findings, storage reads/writes) come from the
            API&apos;s /compare endpoint once configured.
          </p>
        </>
      )}
    </div>
  );
}
