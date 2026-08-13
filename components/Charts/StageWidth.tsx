import type { Schedule } from "@/lib/api";
import { BarMeter } from "./BarMeter";

export interface StageWidthProps {
  schedule: Schedule;
}

/**
 * Stage-width chart derived from the schedule: one bar per CAP-0063 stage whose
 * length encodes the number of transactions executing in parallel. Reuses
 * `BarMeter` so it stays consistent with the other charts.
 */
export function StageWidth({ schedule }: StageWidthProps) {
  const stages = schedule?.stages ?? [];
  if (stages.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        No schedule to display (empty transaction set).
      </p>
    );
  }

  return (
    <BarMeter
      title="Transactions per stage"
      data={stages.map((stage, i) => ({
        label: `stage ${i}`,
        value: stage.txns.length,
        caption: `${stage.txns.length} txns`,
      }))}
    />
  );
}
