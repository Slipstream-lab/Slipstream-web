# Contributing to Slipstream Web

Thanks for helping build the Slipstream dashboard.

## Development

```sh
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_BASE_URL` in `.env.local` to develop against a live
`slipstream-api`; otherwise the app renders labelled demo fixtures.

## Before opening a PR

Run the same checks CI runs:

```sh
npm run lint
npm test
npm run build
```

E2E (optional, needs browser binaries). It runs against a mocked API
(`e2e/mock-api.mjs`) with no real backend:

```sh
npx playwright install chromium
npm run e2e
```

## Conventions

- **TypeScript strict**; no `any` without justification.
- Keep `lib/` pure and unit-tested (`grade.ts`, `format.ts`).
- Response types are generated from `openapi/openapi.json` (see
  `npm run generate:api`); when the API contract changes, update the OpenAPI
  document and regenerate rather than hand-editing `lib/api.types.ts`.
- Grade thresholds in `lib/grade.ts` must match `slipstream-api`'s grade model
  (`modules/analysis/grade.ts`); `lib/grade.test.ts` pins them and provides the
  `thresholdsEqual` drift check.
- Never present demo/fixture data as a real analysis; keep the `DemoBanner`.
- Conventional commits (`feat:`, `fix:`, `docs:`, `test:`, `chore:`).
