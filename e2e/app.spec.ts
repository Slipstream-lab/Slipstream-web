import { test, expect } from "@playwright/test";

/**
 * E2E coverage against a mocked API (see `e2e/mock-api.mjs`, started by
 * `playwright.config.ts`). The dashboard is built with
 * `NEXT_PUBLIC_API_BASE_URL` pointing at the mock, so both server-rendered
 * pages and the client-side compare form fetch deterministic, live-shaped data.
 */

test("landing page renders the value proposition and nav", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /how well does your soroban contract/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Leaderboard", exact: true }),
  ).toBeVisible();
});

test("contract report renders grade, timeline, hot keys and fixes", async ({
  page,
}) => {
  await page.goto("/contract/c1");

  // Grade badge (letter D, from the mocked API).
  await expect(page.getByRole("img", { name: /Grade D/i })).toBeVisible();

  // Section headings.
  await expect(
    page.getByRole("heading", { name: "Cluster timeline" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Hot keys", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Fix list" })).toBeVisible();

  // Timeline content (transaction cells are interactive buttons).
  await expect(
    page.getByRole("button", { name: /transaction 0 in stage 0/i }),
  ).toBeVisible();

  // Hot-key content (mocked ledger key, shown in the chart and the table).
  await expect(page.getByText(/Counter/).first()).toBeVisible();

  // Fix-list recommendation for the mocked detector.
  await expect(page.getByText(/Avoid read-modify-write/i)).toBeVisible();
});

test("leaderboard lists contracts in ranked order", async ({ page }) => {
  await page.goto("/leaderboard");

  const rows = page.locator("tbody tr");
  await expect(rows).toHaveCount(2);
  await expect(rows.nth(0)).toContainText("Per-User Balance");
  await expect(rows.nth(1)).toContainText("Sharded Counter");
});

test("compare renders summary and per-function deltas", async ({ page }) => {
  await page.goto("/compare");

  await page.getByLabel(/baseline contract id/i).fill("c1");
  await page.getByLabel(/candidate contract id/i).fill("c2");
  await page.getByRole("button", { name: /compare/i }).click();

  await expect(
    page.getByRole("heading", { name: "Summary deltas" }),
  ).toBeVisible();
  await expect(page.getByText(/2 fewer/)).toBeVisible();
  await expect(page.getByText(/1 more/)).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Per-function deltas" }),
  ).toBeVisible();
  await expect(page.getByText("increment")).toBeVisible();
});
