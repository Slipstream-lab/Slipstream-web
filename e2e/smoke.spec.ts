import { test, expect } from "@playwright/test";

test("landing page renders the value proposition and nav", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /how well does your soroban contract/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Leaderboard" })).toBeVisible();
});

test("leaderboard page lists contracts", async ({ page }) => {
  await page.goto("/leaderboard");
  await expect(
    page.getByRole("heading", { name: "Leaderboard" }),
  ).toBeVisible();
  // Demo data (when no API is configured) is clearly labelled.
  await expect(page.getByText(/Demo data/i)).toBeVisible();
});

test("contract report renders grade, timeline and fix list", async ({
  page,
}) => {
  await page.goto("/contract/demo-sharded-counter");
  await expect(page.getByText(/Cluster timeline/i)).toBeVisible();
  await expect(page.getByText(/Hot keys/i)).toBeVisible();
  await expect(page.getByText(/Fix list/i)).toBeVisible();
});
