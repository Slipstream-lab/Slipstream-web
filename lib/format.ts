/**
 * Pure formatting helpers for rendering Slipstream data. No side effects.
 */

import type { LedgerKey, StaticKey } from "./api";

/** Renders a static analysis key: dotted segments, or `(dynamic)` when empty. */
export function renderStaticKey(key: StaticKey): string {
  if (!key.segments || key.segments.length === 0) return "(dynamic)";
  return key.segments.join(".");
}

/**
 * Renders a profiled `LedgerKey` enum object to a compact, stable string,
 * mirroring the engine's `Display` formatting.
 */
export function renderLedgerKey(key: LedgerKey): string {
  if (typeof key === "string") return key;
  const k = key as Record<string, unknown>;
  if ("Account" in k) {
    return `account:${(k.Account as { account_id: string }).account_id}`;
  }
  if ("TrustLine" in k) {
    const t = k.TrustLine as { account_id: string; asset: string };
    return `trustline:${t.account_id}:${t.asset}`;
  }
  if ("ContractData" in k) {
    const c = k.ContractData as { contract_id: string; key: string };
    return `contract:${shortenAddress(c.contract_id)}:${c.key}`;
  }
  if ("ContractCode" in k) {
    return `code:${shortenAddress((k.ContractCode as { contract_id: string }).contract_id)}`;
  }
  if ("ContractTtl" in k) {
    return `ttl:${shortenAddress((k.ContractTtl as { contract_id: string }).contract_id)}`;
  }
  if ("Other" in k) return `other:${String(k.Other)}`;
  return JSON.stringify(key);
}

/** Shortens a long Stellar address to `PREFIX…SUFFIX` for display. */
export function shortenAddress(address: string, edge = 4): string {
  if (address.length <= edge * 2 + 1) return address;
  return `${address.slice(0, edge)}…${address.slice(-edge)}`;
}

/** Formats a ratio (e.g. parallelism) with a fixed number of decimals. */
export function formatRatio(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return "—";
  return value.toFixed(decimals);
}

/** Formats a 0–1 fraction as an integer percentage. */
export function formatPercent(fraction: number): string {
  if (!Number.isFinite(fraction)) return "—";
  return `${Math.round(fraction * 100)}%`;
}

/** Formats an integer count with thousands separators. */
export function formatCount(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

/** Turns a detector slug into a human-readable title (`write-in-loop` → `Write In Loop`). */
export function detectorTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
