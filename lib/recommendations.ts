/**
 * Maps each `slipstream-core` detector to a concrete, actionable fix
 * recommendation shown in the UI's fix list.
 */

import type { DetectorName } from "./api";

export interface Recommendation {
  title: string;
  detail: string;
}

const RECOMMENDATIONS: Record<DetectorName, Recommendation> = {
  "global-static-write": {
    title: "Shard the global key",
    detail:
      "A single static key is written from multiple paths, serializing every writer. Split it into per-shard or per-account keys so independent writers touch disjoint ledger entries.",
  },
  "write-in-loop": {
    title: "Bound or batch the loop writes",
    detail:
      "Storage writes inside a loop grow the write-footprint unpredictably. Aggregate the result and write once, or cap the iteration count so the footprint stays fixed.",
  },
  "read-modify-write": {
    title: "Avoid read-modify-write on hot keys",
    detail:
      "Reading then writing the same key forces every writer to serialize. Use a commutative/sharded accumulator, or move the mutation off the hot path (e.g. lazy accrual).",
  },
  "duplicate-read": {
    title: "Deduplicate repeated reads",
    detail:
      "The same key is read multiple times in one function, amplifying the read set. Read once and reuse the value.",
  },
};

const GENERIC: Recommendation = {
  title: "Review contention source",
  detail:
    "This finding indicates a potential contention point. Review the flagged key and consider narrowing or sharding its footprint.",
};

export function recommendationFor(detector: string): Recommendation {
  return RECOMMENDATIONS[detector as DetectorName] ?? GENERIC;
}
