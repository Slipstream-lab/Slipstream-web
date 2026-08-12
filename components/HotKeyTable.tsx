"use client";

import { useMemo, useState } from "react";
import type { HotKey } from "@/lib/api";
import { renderLedgerKey, formatCount } from "@/lib/format";

export interface HotKeyTableProps {
  hotKeys: HotKey[];
}

type SortKey = "writes" | "reads" | "touch_count";

/** A sortable table of the most-contended ledger keys. */
export function HotKeyTable({ hotKeys }: HotKeyTableProps) {
  const [sortBy, setSortBy] = useState<SortKey>("writes");

  const rows = useMemo(
    () => [...hotKeys].sort((a, b) => b[sortBy] - a[sortBy]),
    [hotKeys, sortBy],
  );

  if (hotKeys.length === 0) {
    return (
      <p className="text-sm text-slate-400">No hot keys in this profile.</p>
    );
  }

  const header = (label: string, key: SortKey) => (
    <th
      className="px-3 py-2 text-right font-medium"
      aria-sort={sortBy === key ? "descending" : "none"}
    >
      <button
        type="button"
        onClick={() => setSortBy(key)}
        className={`inline-flex items-center gap-1 hover:text-slate-100 ${
          sortBy === key ? "text-slate-100" : "text-slate-400"
        }`}
      >
        {label}
        {sortBy === key && <span aria-hidden>▾</span>}
      </button>
    </th>
  );

  return (
    <div className="overflow-x-auto rounded-lg ring-1 ring-slate-800">
      <table className="w-full text-sm">
        <thead className="bg-slate-900/60 text-slate-300">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Ledger key</th>
            {header("Reads", "reads")}
            {header("Writes", "writes")}
            {header("Touches", "touch_count")}
          </tr>
        </thead>
        <tbody>
          {rows.map((hk, i) => (
            <tr
              key={`${renderLedgerKey(hk.key)}-${i}`}
              className="border-t border-slate-800/70"
            >
              <td className="px-3 py-2 font-mono text-xs text-slate-200">
                {renderLedgerKey(hk.key)}
              </td>
              <td className="px-3 py-2 text-right text-slate-300">
                {formatCount(hk.reads)}
              </td>
              <td className="px-3 py-2 text-right font-semibold text-amber-300">
                {formatCount(hk.writes)}
              </td>
              <td className="px-3 py-2 text-right text-slate-300">
                {formatCount(hk.touch_count)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
