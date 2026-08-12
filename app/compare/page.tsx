import { BarMeter, DemoBanner } from "@/components";
import { isApiConfigured } from "@/lib/api";
import { DEMO_BANNER, DEMO_CONTRACT, DEMO_LEADERBOARD } from "@/lib/fixtures";

/**
 * Comparison page foundation. When the API is configured this page will diff two
 * contracts via `api.compare(left, right)`; until then it renders a clearly
 * labelled demo comparison of the naive contract against the ecosystem leader so
 * the layout and encoding are exercised.
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
        {live
          ? "Live comparison via the API will populate detector and footprint deltas."
          : "Live deltas (detector findings, storage reads/writes) come from the API's /compare endpoint once configured."}
      </p>
    </div>
  );
}
