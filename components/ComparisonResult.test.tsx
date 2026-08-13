import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ComparisonResult } from "@/components/ComparisonResult";
import type { Comparison } from "@/lib/api";

const COMPARISON: Comparison = {
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

describe("ComparisonResult", () => {
  it("renders summary deltas with direction indicators", () => {
    render(<ComparisonResult comparison={COMPARISON} />);
    expect(screen.getByText("Detector findings")).toBeInTheDocument();
    expect(screen.getByText("Storage reads")).toBeInTheDocument();
    expect(screen.getByText("Storage writes")).toBeInTheDocument();
    // Lower is better: negatives are "fewer", positives are "more".
    expect(screen.getByText(/2 fewer/)).toBeInTheDocument();
    expect(screen.getByText(/5 fewer/)).toBeInTheDocument();
    expect(screen.getByText(/1 more/)).toBeInTheDocument();
  });

  it("renders per-function deltas with direction indicators", () => {
    render(<ComparisonResult comparison={COMPARISON} />);
    expect(screen.getByText("increment")).toBeInTheDocument();
    expect(screen.getByText(/1 fewer/)).toBeInTheDocument();
    expect(screen.getByText(/3 fewer/)).toBeInTheDocument();
    expect(screen.getByText(/no change/)).toBeInTheDocument();
  });

  it("shows an empty message when there are no per-function deltas", () => {
    render(
      <ComparisonResult comparison={{ ...COMPARISON, functions: [] }} />,
    );
    expect(
      screen.getByText(/No per-function deltas returned/i),
    ).toBeInTheDocument();
  });
});
