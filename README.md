# Slipstream Web

The frontend dashboard for **Slipstream** — a contention-analysis platform for
Stellar / Soroban smart contracts. It visualizes how efficiently a contract's
transaction footprints parallelize under Stellar's phased execution model:
a contract **grade**, a **cluster timeline** (CAP-0063 stages), **hot keys**
(the most-contended ledger entries), a prioritized **fix list**, a
**leaderboard**, and a **compare** view (naive vs optimized).

Built with Next.js (App Router) + TypeScript + Tailwind CSS. It consumes the
[`slipstream-api`](https://github.com/Slipstream-lab/Slipstream-api) backend.

## Quick start

```sh
npm install
npm run dev        # http://localhost:3000
```

Without a backend the dashboard renders **clearly-labelled demo fixtures** so
the UI is fully explorable. Point it at a live API by setting the base URL:

```sh
cp .env.example .env.local
# NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

When `NEXT_PUBLIC_API_BASE_URL` is set, pages fetch live data via `lib/api.ts`
and the demo banner disappears.

## Project structure

```
app/
  page.tsx                 # landing / overview
  contract/[id]/page.tsx   # grade + cluster timeline + hot keys + fix list
  leaderboard/page.tsx     # ecosystem contention ranking
  compare/page.tsx         # naive vs optimized comparison
components/
  GradeBadge, ClusterTimeline, HotKeyTable, FixList, Charts/BarMeter
  states/{Loading,ErrorState,EmptyState}, DemoBanner
lib/
  api.ts             # typed API client + response types (mirrors slipstream-core)
  grade.ts           # score -> letter grade mapping (keep in sync with the API)
  format.ts          # pure formatting helpers
  recommendations.ts # detector -> fix recommendation
  fixtures.ts        # DEMO data (clearly labelled; never presented as real)
e2e/                 # Playwright specs
```

## How it consumes `slipstream-api`

`lib/api.ts` is the single integration point. Its response types are generated
from the API's OpenAPI document (`openapi/openapi.json`) into
`lib/api.types.ts` — run `npm run generate:api` after the API contract changes.
They mirror the `slipstream-core` JSON contract exactly as surfaced by the API:

- `AnalysisReport` — from `slipstream scan --json` (`source_name`, `StaticKey`
  segment lists, nullable detector `function`/`key`).
- `ProfileReport` — from `slipstream profile --json` (metrics + `schedule`;
  `hot_keys[].key` is a structured `LedgerKey`).

The client throws `ApiError` on failure and never substitutes fake data.

## Scripts

| Script           | Purpose                                                     |
| ---------------- | ----------------------------------------------------------- |
| `npm run dev`    | Dev server                                                  |
| `npm run build`  | Production build                                            |
| `npm run lint`   | ESLint (next/core-web-vitals)                               |
| `npm test`       | Vitest unit tests                                           |
| `npm run generate:api` | Regenerate `lib/api.types.ts` from `openapi/openapi.json` |
| `npm run e2e`    | Playwright E2E (requires `npx playwright install chromium`) |
| `npm run format` | Prettier                                                    |

## Demo data

Anything from `lib/fixtures.ts` is illustrative and always rendered behind a
visible "Demo data" banner. It is never presented as a real analysis result.

## License

MIT — see [LICENSE](./LICENSE).
