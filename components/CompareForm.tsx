"use client";

import { useState, type FormEvent } from "react";
import { api, ApiError, type Comparison } from "@/lib/api";
import { ErrorState, Loading } from "@/components";
import { ComparisonResult } from "./ComparisonResult";

type Status =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "success"; comparison: Comparison }
  | { state: "error"; message: string };

const inputClass =
  "rounded bg-slate-900 px-3 py-2 font-mono text-sm text-slate-100 ring-1 ring-slate-700 focus:outline-none focus:ring-sky-500";

/** Form that diffs two contracts via `api.compare` and renders the deltas. */
export function CompareForm() {
  const [leftId, setLeftId] = useState("");
  const [rightId, setRightId] = useState("");
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function runCompare(left: string, right: string) {
    if (!left || !right) {
      setStatus({
        state: "error",
        message: "Enter both a baseline and a candidate contract id.",
      });
      return;
    }
    setStatus({ state: "loading" });
    try {
      const comparison = await api.compare(left, right);
      setStatus({ state: "success", comparison });
    } catch (err) {
      setStatus({
        state: "error",
        message:
          err instanceof ApiError ? err.message : "Comparison failed.",
      });
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    runCompare(leftId.trim(), rightId.trim());
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <label className="flex flex-1 flex-col gap-1 text-sm text-slate-300">
          Baseline contract id
          <input
            value={leftId}
            onChange={(e) => setLeftId(e.target.value)}
            placeholder="demo-sharded-counter"
            className={inputClass}
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm text-slate-300">
          Candidate contract id
          <input
            value={rightId}
            onChange={(e) => setRightId(e.target.value)}
            placeholder="demo-per-user-balance"
            className={inputClass}
          />
        </label>
        <button
          type="submit"
          className="rounded bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
        >
          Compare
        </button>
      </form>

      {status.state === "loading" && <Loading label="Comparing contracts…" />}
      {status.state === "error" && (
        <ErrorState
          message={status.message}
          onRetry={() => runCompare(leftId.trim(), rightId.trim())}
        />
      )}
      {status.state === "success" && (
        <ComparisonResult comparison={status.comparison} />
      )}
    </div>
  );
}
