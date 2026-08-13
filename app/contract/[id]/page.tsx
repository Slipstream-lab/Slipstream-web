import Link from "next/link";
import {
  ClusterTimeline,
  ContentionDistribution,
  DemoBanner,
  EmptyState,
  FixList,
  GradeBadge,
  HotKeyTable,
  StageWidth,
} from "@/components";
import { loadContract } from "@/lib/data";
import { DEMO_BANNER } from "@/lib/fixtures";
import { formatCount, formatRatio } from "@/lib/format";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ContractPage({ params }: PageProps) {
  const { id } = await params;

  // Errors propagate to the route-level error boundary (error.tsx), which
  // offers a retry. The live-vs-demo decision is made in lib/data.ts.
  const { data: contract, isDemo } = await loadContract(id);

  const stat = (label: string, value: string) => (
    <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200 dark:bg-slate-900/50 dark:ring-slate-800">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        {value}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {isDemo && <DemoBanner message={DEMO_BANNER} />}

      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {contract.name}
          </h1>
          {contract.address && (
            <p className="font-mono text-xs text-slate-500">
              {contract.address}
            </p>
          )}
        </div>
        {contract.grade ? (
          <GradeBadge score={contract.grade.score} showScore size="lg" />
        ) : (
          <span className="text-sm text-slate-500">Not yet graded</span>
        )}
      </header>

      {contract.profile && (
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stat(
            "Transactions",
            formatCount(contract.profile.transaction_count),
          )}
          {stat("Stages", formatCount(contract.profile.stage_count))}
          {stat("Parallelism", formatRatio(contract.profile.parallelism))}
          {stat("Conflicts", formatCount(contract.profile.total_conflicts))}
        </section>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
          Cluster timeline
        </h2>
        {contract.profile ? (
          <div className="flex flex-col gap-6">
            <ClusterTimeline schedule={contract.profile.schedule} />
            <StageWidth schedule={contract.profile.schedule} />
          </div>
        ) : (
          <EmptyState
            title="No profile yet"
            hint="Run an analysis to populate the timeline."
          />
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
          Hot keys
        </h2>
        {contract.profile ? (
          <div className="flex flex-col gap-6">
            <ContentionDistribution hotKeys={contract.profile.hot_keys} />
            <HotKeyTable hotKeys={contract.profile.hot_keys} />
          </div>
        ) : (
          <EmptyState title="No hot keys yet" />
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
          Fix list
        </h2>
        {contract.analysis ? (
          <FixList findings={contract.analysis.detectors} />
        ) : (
          <EmptyState title="No static analysis yet" />
        )}
      </section>

      <Link
        href="/leaderboard"
        className="text-sm text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
      >
        ← Back to leaderboard
      </Link>
    </div>
  );
}
