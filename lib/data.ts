/**
 * Shared data-access layer for server components.
 *
 * This is the single place that decides between live API data and clearly
 * labelled demo fixtures, and it applies Next.js data-cache revalidation to
 * live requests. Pages consume `loadContract` / `loadLeaderboard` (and their
 * `{ data, isDemo }` result) instead of reaching for `api` or
 * `isApiConfigured` directly.
 *
 * Errors are normalized by `lib/api.ts` (which throws `ApiError`) and
 * propagate to route-level error boundaries; this layer never fabricates data.
 */

import { unstable_cache } from "next/cache";
import {
  api,
  isApiConfigured,
  type Contract,
  type LeaderboardEntry,
} from "./api";
import { DEMO_CONTRACT, DEMO_LEADERBOARD } from "./fixtures";

export interface DataResult<T> {
  data: T;
  /** True when rendering demo fixtures rather than live API data. */
  isDemo: boolean;
}

/** Cross-request cache lifetime for live data, in seconds. */
export const REVALIDATE_SECONDS = 60;

/**
 * The centralized live-vs-demo decision point. Returns the demo value (flagged
 * as demo) when the API is unconfigured; otherwise resolves the live loader.
 */
export function resolve<T>(
  demo: T,
  live: () => Promise<T>,
): Promise<DataResult<T>> {
  if (!isApiConfigured()) {
    return Promise.resolve({ data: demo, isDemo: true });
  }
  return live().then((data) => ({ data, isDemo: false }));
}

/** Wrap a live loader with Next.js data-cache revalidation. */
function cached<T>(key: string[], loader: () => Promise<T>): Promise<T> {
  return unstable_cache(loader, key, { revalidate: REVALIDATE_SECONDS })();
}

export function loadContract(id: string): Promise<DataResult<Contract>> {
  return resolve(
    { ...DEMO_CONTRACT, id },
    () => cached(["contract", id], () => api.getContract(id)),
  );
}

export function loadLeaderboard(): Promise<DataResult<LeaderboardEntry[]>> {
  return resolve(DEMO_LEADERBOARD, () =>
    cached(["leaderboard"], () => api.getLeaderboard()),
  );
}
