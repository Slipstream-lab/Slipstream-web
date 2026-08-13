import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E configuration.
 *
 * Boots the production build and a mock `slipstream-api` (`e2e/mock-api.mjs`)
 * side by side. The build is made with `NEXT_PUBLIC_API_BASE_URL` pointing at
 * the mock, so server components (SSR fetches) and the client compare form
 * both get deterministic, live-shaped responses without a real backend.
 *
 * The app port is configurable via `PORT` (default 3000) and the mock API via
 * `MOCK_API_PORT` (default 3100).
 */
const PORT = Number(process.env.PORT ?? 3000);
const baseURL = `http://localhost:${PORT}`;

const MOCK_API_PORT = Number(process.env.MOCK_API_PORT ?? 3100);
const MOCK_API_URL = `http://localhost:${MOCK_API_PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: `npm run build && npm run start -- --port ${PORT}`,
      env: { NEXT_PUBLIC_API_BASE_URL: MOCK_API_URL },
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
    },
    {
      command: `node e2e/mock-api.mjs`,
      env: { MOCK_API_PORT: String(MOCK_API_PORT) },
      url: `${MOCK_API_URL}/health`,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
