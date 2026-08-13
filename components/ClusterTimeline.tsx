"use client";

import { useState } from "react";
import type { Schedule } from "@/lib/api";

export interface ClusterTimelineProps {
  schedule: Schedule;
  /** Optional resolver for a transaction's footprint/conflicts summary. */
  txnFootprint?: (txn: number) => string | undefined;
}

/**
 * Visualizes a schedule as a sequence of CAP-0063 stages. Each stage is a
 * horizontal band; the transactions inside it execute in parallel. Wider bands
 * mean more parallelism; more bands mean a longer serial critical path.
 *
 * Interactive: hovering or focusing a transaction highlights every cell with
 * that transaction number across the timeline and, when a `txnFootprint`
 * resolver is supplied, surfaces its footprint/conflicts. Cells are real
 * buttons so the interaction is keyboard-accessible.
 */
export function ClusterTimeline({
  schedule,
  txnFootprint,
}: ClusterTimelineProps) {
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const stages = schedule?.stages ?? [];

  if (stages.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        No schedule to display (empty transaction set).
      </p>
    );
  }

  const maxWidth = Math.max(...stages.map((s) => s.txns.length), 1);
  const highlightedStage =
    highlighted === null
      ? null
      : stages.findIndex((s) => s.txns.includes(highlighted));

  const footprint =
    highlighted !== null && txnFootprint
      ? txnFootprint(highlighted)
      : undefined;

  return (
    <div className="flex flex-col gap-2" aria-label="Cluster timeline">
      {stages.map((stage, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-16 shrink-0 text-right text-xs font-medium text-slate-400">
            stage {i}
          </span>
          <div className="flex flex-1 flex-wrap gap-1">
            {stage.txns.map((txn) => {
              const isHighlighted = highlighted === txn;
              const isDimmed = highlighted !== null && !isHighlighted;
              return (
                <button
                  key={txn}
                  type="button"
                  onMouseEnter={() => setHighlighted(txn)}
                  onMouseLeave={() => setHighlighted(null)}
                  onFocus={() => setHighlighted(txn)}
                  onBlur={() => setHighlighted(null)}
                  aria-pressed={isHighlighted}
                  aria-label={`transaction ${txn} in stage ${i}`}
                  title={`transaction ${txn} in stage ${i}`}
                  className={`inline-flex h-6 min-w-6 items-center justify-center rounded px-1.5 text-xs font-mono ring-1 transition-colors ${
                    isHighlighted
                      ? "bg-sky-500/40 text-white ring-sky-400"
                      : isDimmed
                        ? "bg-slate-800/40 text-slate-500 ring-slate-700/40"
                        : "bg-sky-500/20 text-sky-200 ring-sky-500/30 hover:bg-sky-500/40"
                  }`}
                >
                  {txn}
                </button>
              );
            })}
          </div>
          <span className="w-24 shrink-0 text-xs text-slate-500">
            {stage.txns.length}/{maxWidth} wide
          </span>
        </div>
      ))}

      <p aria-live="polite" className="min-h-4 text-xs text-slate-400">
        {highlighted !== null && highlightedStage !== null ? (
          <>
            transaction {highlighted} · stage {highlightedStage}
            {footprint ? ` · ${footprint}` : ""}
          </>
        ) : (
          "Hover or focus a transaction to highlight it."
        )}
      </p>
    </div>
  );
}
