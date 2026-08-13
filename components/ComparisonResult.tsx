import type { Comparison, ComparisonSummary } from "@/lib/api";

/**
 * Renders a signed delta (right − left). Lower is better for every metric we
 * diff, so a negative delta is an improvement. The arrow + word keep the
 * encoding non-color-only.
 */
function Delta({ value }: { value: number }) {
  if (value === 0) {
    return <span className="font-mono text-slate-500 dark:text-slate-400">no change</span>;
  }
  const lower = value < 0;
  const word = lower ? "fewer" : "more";
  return (
    <span
      className={`font-mono ${lower ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
      title={`${Math.abs(value)} ${word} than baseline`}
    >
      {lower ? "↓" : "↑"} {Math.abs(value)} {word}
    </span>
  );
}

const SUMMARY_ROWS: { key: keyof ComparisonSummary; label: string }[] = [
  { key: "detector_findings_delta", label: "Detector findings" },
  { key: "storage_reads_delta", label: "Storage reads" },
  { key: "storage_writes_delta", label: "Storage writes" },
];

export interface ComparisonResultProps {
  comparison: Comparison;
}

/** Summary and per-function deltas with up/down direction indicators. */
export function ComparisonResult({ comparison }: ComparisonResultProps) {
  const { summary, functions } = comparison;

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
          Summary deltas
        </h2>
        <dl className="grid gap-3 sm:grid-cols-3">
          {SUMMARY_ROWS.map(({ key, label }) => (
            <div
              key={key}
              className="rounded-lg bg-white p-4 ring-1 ring-slate-200 dark:bg-slate-900/50 dark:ring-slate-800"
            >
              <dt className="text-xs text-slate-500">{label}</dt>
              <dd className="mt-1 text-sm">
                <Delta value={summary[key]} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
          Per-function deltas
        </h2>
        {functions.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            No per-function deltas returned by the API.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg ring-1 ring-slate-200 dark:ring-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Function</th>
                  <th className="px-3 py-2 text-right font-medium">Findings</th>
                  <th className="px-3 py-2 text-right font-medium">Reads</th>
                  <th className="px-3 py-2 text-right font-medium">Writes</th>
                </tr>
              </thead>
              <tbody>
                {functions.map((fn) => (
                  <tr
                    key={fn.function_name}
                    className="border-t border-slate-200/70 dark:border-slate-800/70"
                  >
                    <td className="px-3 py-2 font-mono text-xs text-slate-800 dark:text-slate-200">
                      {fn.function_name}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Delta value={fn.detector_findings_delta} />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Delta value={fn.storage_reads_delta} />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Delta value={fn.storage_writes_delta} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
