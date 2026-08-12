/**
 * DEMO fixtures — clearly-labelled illustrative data for local development and
 * component previews. These are NOT real analysis results. The UI always shows
 * a visible "Demo data" banner when rendering from these, and switches to the
 * live API when `NEXT_PUBLIC_API_BASE_URL` is set.
 *
 * The shapes mirror the real `slipstream-core` / `slipstream-api` contract so
 * components exercised here behave identically against live data.
 */

import type {
  AnalysisReport,
  Contract,
  LeaderboardEntry,
  ProfileReport,
} from "./api";

export const DEMO_BANNER =
  "Demo data — illustrative fixtures, not a live analysis.";

const DEMO_ANALYSIS: AnalysisReport = {
  source_name: "contracts/sharded-counter/naive/src/lib.rs",
  functions: [
    {
      function_name: "increment",
      storage_reads: [{ segments: ["Counter"] }],
      storage_writes: [{ segments: ["Counter"] }],
    },
    {
      function_name: "reset",
      storage_reads: [],
      storage_writes: [{ segments: ["Counter"] }],
    },
  ],
  detectors: [
    {
      detector: "read-modify-write",
      function: "increment",
      key: "Counter",
      message:
        "function `increment` both reads and writes key `Counter`; read-modify-write access serializes every writer to that key",
    },
    {
      detector: "global-static-write",
      function: null,
      key: "Counter",
      message:
        "static key `Counter` is written from multiple functions (increment, reset); a global contention point",
    },
  ],
};

const DEMO_PROFILE: ProfileReport = {
  source: "DEMO: sharded-counter workload (illustrative, not measured)",
  transaction_count: 12,
  distinct_keys: 6,
  stage_count: 4,
  parallelism: 3.0,
  critical_path_length: 4,
  weighted_critical_path_weight: 16,
  total_conflicts: 14,
  hot_keys: [
    {
      key: { ContractData: { contract_id: "CDEMO000", key: "Counter" } },
      reads: 12,
      writes: 12,
      touch_count: 12,
    },
    {
      key: { ContractData: { contract_id: "CDEMO000", key: "config" } },
      reads: 12,
      writes: 0,
      touch_count: 12,
    },
  ],
  schedule: {
    stages: [
      { txns: [0, 4, 8] },
      { txns: [1, 5, 9] },
      { txns: [2, 6, 10] },
      { txns: [3, 7, 11] },
    ],
  },
};

export const DEMO_CONTRACT: Contract = {
  id: "demo-sharded-counter",
  name: "Sharded Counter (demo)",
  address: "CDEMO0000000000000000000000000000000000000000000000000000",
  grade: { score: 48, letter: "D" },
  analysis: DEMO_ANALYSIS,
  profile: DEMO_PROFILE,
};

export const DEMO_LEADERBOARD: LeaderboardEntry[] = [
  {
    contractId: "demo-per-user-balance",
    name: "Per-User Balance (demo)",
    score: 94,
    parallelism: 7.8,
    rank: 1,
  },
  {
    contractId: "demo-lazy-fee",
    name: "Lazy Fee Accrual (demo)",
    score: 81,
    parallelism: 5.2,
    rank: 2,
  },
  {
    contractId: "demo-sharded-counter",
    name: "Sharded Counter (demo)",
    score: 48,
    parallelism: 3.0,
    rank: 3,
  },
  {
    contractId: "demo-global-nonce",
    name: "Global Nonce (demo)",
    score: 22,
    parallelism: 1.4,
    rank: 4,
  },
];
