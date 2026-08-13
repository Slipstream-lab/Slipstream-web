/**
 * Typed client for the Slipstream API (`slipstream-api`, NestJS).
 *
 * Response types are generated from the API's OpenAPI document
 * (`openapi/openapi.json`) into `lib/api.types.ts`; regenerate with
 * `npm run generate:api`. Do not hand-edit the generated file.
 *
 * The client never fabricates data on failure — it throws {@link ApiError}.
 */

import type { components } from "./api.types";

// --- Generated response types (aliased for ergonomic imports) ---------------

export type DetectorName = components["schemas"]["DetectorName"];
export type StaticKey = components["schemas"]["StaticKey"];
export type DetectorFinding = components["schemas"]["DetectorFinding"];
export type FunctionAccess = components["schemas"]["FunctionAccess"];
export type AnalysisReport = components["schemas"]["AnalysisReport"];
export type LedgerKey = components["schemas"]["LedgerKey"];
export type HotKey = components["schemas"]["HotKey"];
export type Cluster = components["schemas"]["Cluster"];
export type Schedule = components["schemas"]["Schedule"];
export type ProfileReport = components["schemas"]["ProfileReport"];
export type Grade = components["schemas"]["Grade"];
export type Contract = components["schemas"]["Contract"];
export type LeaderboardEntry = components["schemas"]["LeaderboardEntry"];
export type ComparisonSummary = components["schemas"]["ComparisonSummary"];
export type ComparisonFunctionDelta =
  components["schemas"]["ComparisonFunctionDelta"];
export type Comparison = components["schemas"]["Comparison"];

// --- Known detector names (runtime constant, mirrors the OpenAPI enum) -------

export const DETECTOR_NAMES = [
  "global-static-write",
  "write-in-loop",
  "read-modify-write",
  "duplicate-read",
] as const satisfies readonly DetectorName[];

// --- API client -------------------------------------------------------------

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
