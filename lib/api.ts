/**
 * Typed client for the Slipstream API (`slipstream-api`, NestJS).
 *
 * The response types mirror the `slipstream-core` JSON contract exactly, as
 * surfaced by the API:
 *   - static analysis:  `AnalysisReport` (from `slipstream scan --json`)
 *   - dynamic profiling: `ProfileReport` (from `slipstream profile --json`)
 *
 * Note the fidelity details that come straight from the engine:
 *   - a static storage key is a `StaticKey` (`{ segments: string[] }`); an empty
 *     segment list is the engine's "dynamic" marker.
 *   - a profiled hot key's `key` is a structured `LedgerKey` enum object.
 *   - detector `function`/`key` are nullable.
 *
 * The client never fabricates data on failure — it throws {@link ApiError}.
 */

// --- slipstream-core: static analysis (`scan`) ------------------------------

export const DETECTOR_NAMES = [
  "global-static-write",
  "write-in-loop",
  "read-modify-write",
  "duplicate-read",
] as const;

export type DetectorName = (typeof DETECTOR_NAMES)[number];

/** A static storage key: resolved segments, or `[]` for a dynamic key. */
export interface StaticKey {
  segments: string[];
}

export interface DetectorFinding {
  detector: string;
  function: string | null;
  key: string | null;
  message: string;
}

export interface FunctionAccess {
  function_name: string;
  storage_reads: StaticKey[];
  storage_writes: StaticKey[];
}

export interface AnalysisReport {
  source_name: string;
  functions: FunctionAccess[];
  detectors: DetectorFinding[];
}

// --- slipstream-core: dynamic profiling (`profile`) -------------------------

/**
 * A ledger key as serialized by the engine: an externally-tagged enum. Only the
 * variants the UI needs to render are enumerated; unknown variants fall through
 * to a raw record.
 */
export type LedgerKey =
  | { Account: { account_id: string } }
  | { TrustLine: { account_id: string; asset: string } }
  | { ContractData: { contract_id: string; key: string } }
  | { ContractCode: { contract_id: string } }
  | { ContractTtl: { contract_id: string } }
  | { Other: string }
  | Record<string, unknown>;

export interface HotKey {
  key: LedgerKey;
  reads: number;
  writes: number;
  touch_count: number;
}

export interface Cluster {
  txns: number[];
}

export interface Schedule {
  stages: Cluster[];
}

export interface ProfileReport {
  source: string;
  transaction_count: number;
  distinct_keys: number;
  stage_count: number;
  parallelism: number;
  critical_path_length: number;
  weighted_critical_path_weight: number;
  total_conflicts: number;
  hot_keys: HotKey[];
  schedule: Schedule;
}

// --- API resources ----------------------------------------------------------

/** A contract's current grade, as computed and stored by the API. */
export interface Grade {
  score: number; // 0-100
  letter: string; // A-F
}

export interface Contract {
  id: string;
  name: string;
  address: string | null;
  grade: Grade | null;
  analysis: AnalysisReport | null;
  profile: ProfileReport | null;
}

export interface LeaderboardEntry {
  contractId: string;
  name: string;
  score: number;
  parallelism: number;
  rank: number;
}

export interface ComparisonSummary {
  detector_findings_delta: number;
  storage_reads_delta: number;
  storage_writes_delta: number;
}

export interface Comparison {
  leftId: string;
  rightId: string;
  summary: ComparisonSummary;
}

/** Error thrown by the API client. Never resolves to fake data on failure. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * The configured API base URL, or `null` when unset. When null, pages fall back
 * to clearly-labelled demo data instead of calling a non-existent backend.
 */
export const API_BASE_URL: string | null =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? null;

export function isApiConfigured(): boolean {
  return API_BASE_URL !== null;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError(
      "NEXT_PUBLIC_API_BASE_URL is not configured; no live API to call.",
    );
  }
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { Accept: "application/json", ...(init?.headers ?? {}) },
    });
  } catch (cause) {
    throw new ApiError(
      `Network error calling ${path}: ${(cause as Error).message}`,
    );
  }
  if (!res.ok) {
    throw new ApiError(`API ${path} failed`, res.status);
  }
  return (await res.json()) as T;
}

export const api = {
  getContract: (id: string) =>
    request<Contract>(`/contracts/${encodeURIComponent(id)}`),
  getAnalysis: (id: string) =>
    request<AnalysisReport>(`/analysis/${encodeURIComponent(id)}`),
  getLeaderboard: () => request<LeaderboardEntry[]>(`/leaderboard`),
  compare: (a: string, b: string) =>
    request<Comparison>(
      `/compare?left=${encodeURIComponent(a)}&right=${encodeURIComponent(b)}`,
    ),
};
