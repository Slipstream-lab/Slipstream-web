import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "Slipstream",
  description:
    "Soroban smart-contract contention analysis: grades, cluster timelines, hot keys and fixes.",
};

const THEME_SCRIPT = `(function () {
  try {
    var stored = localStorage.getItem("slipstream-theme");
    var dark = stored
      ? stored === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {
    document.documentElement.classList.add("dark");
  }
})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-screen antialiased">
        <header className="border-b border-slate-200 dark:border-slate-800">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="text-lg font-bold text-slate-900 dark:text-slate-100"
            >
              Slipstream
            </Link>
            <div className="flex items-center gap-5 text-sm text-slate-600 dark:text-slate-300">
              <Link href="/leaderboard" className="hover:text-slate-900 dark:hover:text-slate-100">
                Leaderboard
              </Link>
              <Link href="/compare" className="hover:text-slate-900 dark:hover:text-slate-100">
                Compare
              </Link>
              <Link
                href="/contract/demo-sharded-counter"
                className="hover:text-slate-900 dark:hover:text-slate-100"
              >
                Example
              </Link>
              <ThemeToggle />
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-6 py-8 text-xs text-slate-500 dark:text-slate-600">
          Slipstream Lab · contention analysis for Stellar/Soroban
        </footer>
      </body>
    </html>
  );
}
