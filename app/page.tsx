import Link from "next/link";
import { isApiConfigured } from "@/lib/api";

export default function Home() {
  const live = isApiConfigured();
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          How well does your Soroban contract parallelize?
        </h1>
        <p className="max-w-2xl text-slate-600 dark:text-slate-400">
          Slipstream measures how efficiently a contract&apos;s transaction
          footprints parallelize under Stellar&apos;s phased execution model. It
          turns &quot;this contract is contention-heavy&quot; into concrete,
          reproducible evidence: footprint overlap, conflict graphs, critical
          paths, hot-key rankings and detector findings.
        </p>
        <p className="text-sm text-slate-500">
          Data source:{" "}
          {live ? (
            <span className="text-emerald-600 dark:text-emerald-300">
              live API
            </span>
          ) : (
            <span className="text-amber-600 dark:text-amber-300">
              demo fixtures (set NEXT_PUBLIC_API_BASE_URL for live data)
            </span>
          )}
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            href: "/contract/demo-sharded-counter",
            title: "Contract report",
            body: "Grade, cluster timeline, hot keys and a prioritized fix list.",
          },
          {
            href: "/leaderboard",
            title: "Leaderboard",
            body: "Ecosystem-wide contention ranking across analyzed contracts.",
          },
          {
            href: "/compare",
            title: "Compare",
            body: "Diff a naive implementation against an optimized one.",
          },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl bg-white p-5 ring-1 ring-slate-200 transition hover:ring-sky-500/50 dark:bg-slate-900/50 dark:ring-slate-800"
          >
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">
              {card.title}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {card.body}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
