import type { Schedule } from "@/lib/api";

export interface ClusterTimelineProps {
  schedule: Schedule;
}

/**
 * Visualizes a schedule as a sequence of CAP-0063 stages. Each stage is a
 * horizontal band; the transactions inside it execute in parallel. Wider bands
 * mean more parallelism; more bands mean a longer serial critical path.
 */
export function ClusterTimeline({ schedule }: ClusterTimelineProps) {
  const stages = schedule?.stages ?? [];
  if (stages.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        No schedule to display (empty transaction set).
      </p>
    );
  }

  const maxWidth = Math.max(...stages.map((s) => s.txns.length), 1);

  return (
    <div className="flex flex-col gap-2" aria-label="Cluster timeline">
      {stages.map((stage, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-16 shrink-0 text-right text-xs font-medium text-slate-400">
            stage {i}
          </span>
          <div className="flex flex-1 flex-wrap gap-1">
            {stage.txns.map((txn) => (
              <span
                key={txn}
                className="inline-flex h-6 min-w-6 items-center justify-center rounded bg-sky-500/20 px-1.5 text-xs font-mono text-sky-200 ring-1 ring-sky-500/30"
                title={`transaction ${txn} in stage ${i}`}
              >
                {txn}
              </span>
            ))}
          </div>
          <span className="w-24 shrink-0 text-xs text-slate-500">
            {stage.txns.length}/{maxWidth} wide
          </span>
        </div>
      ))}
    </div>
  );
}
