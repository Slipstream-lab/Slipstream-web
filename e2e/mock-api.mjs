/**
 * Minimal mock of the Slipstream API used by the Playwright E2E suite.
 *
 * Started by `playwright.config.ts` alongside the production build, so the
 * dashboard's server components (which fetch during SSR) and the client-side
 * compare form both hit deterministic, live-shaped responses — no real backend
 * is required.
 */

import { createServer } from "node:http";

const PORT = Number(process.env.MOCK_API_PORT ?? 3100);

const contract = {
  id: "c1",
  name: "Sharded Counter",
  address: "CDEMO0000000000000000000000000000000000000000000000000000",
  grade: { score: 48, letter: "D" },
  analysis: {
    source_name: "contracts/sharded-counter/naive/src/lib.rs",
    functions: [
      {
        function_name: "increment",
        storage_reads: [{ segments: ["Counter"] }],
        storage_writes: [{ segments: ["Counter"] }],
      },
    ],
    detectors: [
      {
        detector: "read-modify-write",
        function: "increment",
        key: "Counter",
        message:
          "function `increment` both reads and writes key `Counter`; read-modify-write access serializes every writer to that key",
      },
    ],
  },
  profile: {
    source: "mock profile (illustrative)",
    transaction_count: 12,
    distinct_keys: 6,
    stage_count: 4,
    parallelism: 3.0,
    critical_path_length: 4,
    weighted_critical_path_weight: 16,
    total_conflicts: 14,
    hot_keys: [
      {
        key: { ContractData: { contract_id: "CDEMO000", key: "Counter" } },
        reads: 12,
        writes: 12,
        touch_count: 12,
      },
    ],
    schedule: {
      stages: [{ txns: [0, 4, 8] }, { txns: [1, 5, 9] }, { txns: [2, 6, 10] }, { txns: [3, 7, 11] }],
    },
  },
};

const leaderboard = [
  {
    contractId: "c2",
    name: "Per-User Balance",
    score: 94,
    parallelism: 7.8,
    rank: 1,
  },
  {
    contractId: "c1",
    name: "Sharded Counter",
    score: 48,
    parallelism: 3.0,
    rank: 2,
  },
];

const comparison = {
  leftId: "c1",
  rightId: "c2",
  summary: {
    detector_findings_delta: -2,
    storage_reads_delta: -5,
    storage_writes_delta: 1,
  },
  functions: [
    {
      function_name: "increment",
      detector_findings_delta: -1,
      storage_reads_delta: -3,
      storage_writes_delta: 0,
    },
  ],
};

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  // The client-side compare form fetches this server cross-origin.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end(JSON.stringify(body));
}

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method !== "GET") {
    return send(res, 405, { error: "method not allowed" });
  }

  if (url.pathname === "/health") {
    return send(res, 200, { ok: true });
  }

  if (url.pathname === "/leaderboard") {
    return send(res, 200, leaderboard);
  }

  if (url.pathname === "/compare") {
    return send(res, 200, comparison);
  }

  if (url.pathname.startsWith("/contracts/")) {
    const id = url.pathname.slice("/contracts/".length);
    return send(res, 200, { ...contract, id });
  }

  return send(res, 404, { error: `no mock for ${url.pathname}` });
});

server.listen(PORT, () => {
  console.log(`mock-api listening on http://localhost:${PORT}`);
});
