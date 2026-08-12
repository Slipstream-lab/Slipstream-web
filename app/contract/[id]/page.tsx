import Link from "next/link";
import {
  ClusterTimeline,
  DemoBanner,
  EmptyState,
  FixList,
  GradeBadge,
  HotKeyTable,
} from "@/components";
import { api, isApiConfigured, type Contract } from "@/lib/api";
import { DEMO_BANNER, DEMO_CONTRACT } from "@/lib/fixtures";
import { ErrorState } from "@/components/states/ErrorState";
import { formatCount, formatRatio } from "@/lib/format";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Loads a contract from the API when configured, otherwise returns the demo
 * contract. Returns `{ contract, isDemo }` or throws for the error boundary.
 */
async function load(
  id: string,
): Promise<{ contract: Contract; isDemo: boolean }> {
  if (!isApiConfigured()) {
    return { contract: { ...DEMO_CONTRACT, id }, isDemo: true };
  }
  return { contract: await api.getContract(id), isDemo: false };
}

export default async function ContractPage({ params }: PageProps) {
  const { id } = await params;

  let contract: Contract;
  let isDemo = false;
  try {
    ({ contract, isDemo } = await load(id));
  } catch (e) {
    return (
      <ErrorState
        message={`Could not load contract "${id}": ${(e as Error).message}`}
      />
    );
  }

  const stat = (label: string, value: string) => (
    <div className="rounded-lg bg-slate-900/50 p-3 ring-1 ring-slate-800">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-lg font-semibold text-slate-100">{value}</div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {isDemo && <DemoBanner message={DEMO_BANNER} />}

      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">{contract.name}</h1>
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
        <h2 className="mb-3 text-lg font-semibold text-slate-100">
          Cluster timeline
        </h2>
        {contract.profile ? (
          <ClusterTimeline schedule={contract.profile.schedule} />
        ) : (
          <EmptyState
            title="No profile yet"
            hint="Run an analysis to populate the timeline."
          />
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-100">Hot keys</h2>
        {contract.profile ? (
          <HotKeyTable hotKeys={contract.profile.hot_keys} />
        ) : (
          <EmptyState title="No hot keys yet" />
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-100">Fix list</h2>
        {contract.analysis ? (
          <FixList findings={contract.analysis.detectors} />
        ) : (
          <EmptyState title="No static analysis yet" />
        )}
      </section>

      <Link
        href="/leaderboard"
        className="text-sm text-sky-400 hover:text-sky-300"
      >
        ← Back to leaderboard
      </Link>
    </div>
  );
}
