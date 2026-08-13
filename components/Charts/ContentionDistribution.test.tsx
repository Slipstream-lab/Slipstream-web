import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContentionDistribution } from "@/components/Charts/ContentionDistribution";
import type { HotKey } from "@/lib/api";

const HOT_KEYS: HotKey[] = [
  {
    key: { ContractData: { contract_id: "CABC", key: "shard:0" } },
    reads: 3,
    writes: 5,
    touch_count: 8,
  },
  {
    key: { ContractData: { contract_id: "CABC", key: "config" } },
    reads: 12,
    writes: 0,
    touch_count: 12,
  },
];

describe("ContentionDistribution", () => {
  it("renders an empty message when there are no hot keys", () => {
    render(<ContentionDistribution hotKeys={[]} />);
    expect(screen.getByText(/No hot keys in this profile/i)).toBeInTheDocument();
  });

  it("renders a labelled bar per hot key with exact counts", () => {
    render(<ContentionDistribution hotKeys={HOT_KEYS} />);
    expect(
      screen.getByRole("img", { name: /Contention by hot key/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/shard:0/)).toBeInTheDocument();
    expect(screen.getByText(/config/)).toBeInTheDocument();
    // Exact counts are carried in the captions (non-length-only encoding).
    expect(screen.getByText("5w · 3r · 8t")).toBeInTheDocument();
    expect(screen.getByText("0w · 12r · 12t")).toBeInTheDocument();
  });
});
