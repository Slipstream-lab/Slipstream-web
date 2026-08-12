import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HotKeyTable } from "@/components/HotKeyTable";
import type { HotKey } from "@/lib/api";

const HOT_KEYS: HotKey[] = [
  {
    key: { ContractData: { contract_id: "CABCDEFGH", key: "shard:0" } },
    reads: 3,
    writes: 5,
    touch_count: 8,
  },
  {
    key: { ContractData: { contract_id: "CABCDEFGH", key: "config" } },
    reads: 12,
    writes: 0,
    touch_count: 12,
  },
];

describe("HotKeyTable", () => {
  it("renders an empty message with no keys", () => {
    render(<HotKeyTable hotKeys={[]} />);
    expect(screen.getByText(/No hot keys/i)).toBeInTheDocument();
  });

  it("renders a row per hot key with rendered ledger keys", () => {
    render(<HotKeyTable hotKeys={HOT_KEYS} />);
    expect(screen.getByText(/shard:0/)).toBeInTheDocument();
    expect(screen.getByText(/config/)).toBeInTheDocument();
    // Column headers are sortable buttons.
    expect(screen.getByRole("button", { name: /Writes/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reads/i })).toBeInTheDocument();
  });
});
