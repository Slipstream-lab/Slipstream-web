import type { HotKey } from "@/lib/api";
import { renderLedgerKey } from "@/lib/format";
import { BarMeter } from "./BarMeter";

export interface ContentionDistributionProps {
  hotKeys: HotKey[];
}

/**
 * Per-hot-key contention distribution. Bar length encodes write count (the
 * channel that serializes writers); the caption carries exact read/write/touch
 * counts so the encoding is never color- or length-only. Reuses `BarMeter`.
 */
export function ContentionDistribution({
  hotKeys,
}: ContentionDistributionProps) {
  if (hotKeys.length === 0) {
    return (
      <p className="text-sm text-slate-400">No hot keys in this profile.</p>
    );
  }

  return (
    <BarMeter
      title="Contention by hot key (writes)"
      data={hotKeys.map((hk) => ({
        label: renderLedgerKey(hk.key),
        value: hk.writes,
        caption: `${hk.writes}w · ${hk.reads}r · ${hk.touch_count}t`,
      }))}
    />
  );
}
