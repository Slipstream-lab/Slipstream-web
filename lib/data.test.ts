import { describe, it, expect, vi, beforeEach } from "vitest";

// `lib/data.ts` reads `NEXT_PUBLIC_API_BASE_URL` at import time and pulls in
// `next/cache`, so each test reloads the module under a stubbed env to exercise
// both sides of the centralized live-vs-demo decision.
describe("data layer", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("flags demo data when the API is not configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", undefined);
    const { resolve } = await import("@/lib/data");
    const result = await resolve("demo-value", () =>
      Promise.resolve("live-value"),
    );
    expect(result).toEqual({ data: "demo-value", isDemo: true });
  });

  it("resolves live data (unflagged) when the API is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://api.example.com");
    const { resolve } = await import("@/lib/data");
    const result = await resolve("demo-value", () =>
      Promise.resolve("live-value"),
    );
    expect(result).toEqual({ data: "live-value", isDemo: false });
  });

  it("returns demo leaderboard rows when the API is not configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", undefined);
    const { loadLeaderboard } = await import("@/lib/data");
    const result = await loadLeaderboard();
    expect(result.isDemo).toBe(true);
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data[0].contractId).toMatch(/^demo-/);
  });

  it("returns the demo contract (with the requested id) when unconfigured", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", undefined);
    const { loadContract } = await import("@/lib/data");
    const result = await loadContract("some-contract-id");
    expect(result.isDemo).toBe(true);
    expect(result.data.id).toBe("some-contract-id");
  });
});
