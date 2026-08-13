import type { DetectorFinding } from "@/lib/api";
import { detectorTitle } from "@/lib/format";
import { recommendationFor } from "@/lib/recommendations";

export interface FixListProps {
  findings: DetectorFinding[];
}

/** Groups detector findings by detector and renders a recommendation per group. */
export function FixList({ findings }: FixListProps) {
  if (findings.length === 0) {
    return (
      <p className="text-sm text-emerald-600 dark:text-emerald-300">
        No detector findings — nothing to fix. 🎉
      </p>
    );
  }

  const groups = new Map<string, DetectorFinding[]>();
  for (const f of findings) {
    const list = groups.get(f.detector) ?? [];
    list.push(f);
    groups.set(f.detector, list);
  }

  return (
    <ul className="flex flex-col gap-4">
      {[...groups.entries()].map(([detector, group]) => {
        const rec = recommendationFor(detector);
        return (
          <li
            key={detector}
            className="rounded-lg bg-white p-4 ring-1 ring-slate-200 dark:bg-slate-900/50 dark:ring-slate-800"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                {rec.title}
              </h3>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {detectorTitle(detector)} · {group.length}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {rec.detail}
            </p>
            <ul className="mt-3 flex flex-col gap-1 border-t border-slate-200 pt-3 dark:border-slate-800">
              {group.map((f, i) => (
                <li
                  key={i}
                  className="text-xs text-slate-600 dark:text-slate-400"
                >
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {f.function ?? "(module)"}
                    {f.key ? ` → ${f.key}` : ""}
                  </span>
                  {": "}
                  {f.message}
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}
