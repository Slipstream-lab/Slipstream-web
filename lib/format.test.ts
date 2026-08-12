import { describe, it, expect } from "vitest";
import {
  renderStaticKey,
  renderLedgerKey,
  shortenAddress,
  formatRatio,
  formatPercent,
  formatCount,
  detectorTitle,
} from "@/lib/format";

describe("format", () => {
  it("renders static keys, using (dynamic) for empty segments", () => {
    expect(renderStaticKey({ segments: ["Counter"] })).toBe("Counter");
    expect(renderStaticKey({ segments: ["a", "b"] })).toBe("a.b");
    expect(renderStaticKey({ segments: [] })).toBe("(dynamic)");
  });

  it("renders ledger key enum variants", () => {
    expect(renderLedgerKey({ Account: { account_id: "GABC" } })).toBe(
      "account:GABC",
    );
    // contract_id "CABCDEFGHIJK" shortens to "CABC…HIJK" (edge = 4).
    expect(
      renderLedgerKey({
        ContractData: { contract_id: "CABCDEFGHIJK", key: "shard:0" },
      }),
    ).toBe("contract:CABC…HIJK:shard:0");
    expect(renderLedgerKey({ Other: "weird" })).toBe("other:weird");
  });

  it("shortens long addresses", () => {
    expect(shortenAddress("CABCDEFGHIJKLMNOP")).toBe("CABC…MNOP");
    expect(shortenAddress("SHORT")).toBe("SHORT");
  });

  it("formats ratios, percents and counts", () => {
    expect(formatRatio(3.14159)).toBe("3.14");
    expect(formatRatio(Infinity)).toBe("—");
    expect(formatPercent(0.5)).toBe("50%");
    expect(formatPercent(NaN)).toBe("—");
    expect(formatCount(12000)).toBe("12,000");
  });

  it("titles detector slugs", () => {
    expect(detectorTitle("write-in-loop")).toBe("Write In Loop");
    expect(detectorTitle("read-modify-write")).toBe("Read Modify Write");
  });
});
