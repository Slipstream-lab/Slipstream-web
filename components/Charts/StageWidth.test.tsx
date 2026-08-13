import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StageWidth } from "@/components/Charts/StageWidth";
import type { Schedule } from "@/lib/api";

const SCHEDULE: Schedule = {
  stages: [{ txns: [0, 4, 8] }, { txns: [1, 5] }, { txns: [2, 6, 9, 11] }],
};

describe("StageWidth", () => {
  it("renders an empty message when there is no schedule", () => {
    render(<StageWidth schedule={{ stages: [] }} />);
    expect(screen.getByText(/No schedule to display/i)).toBeInTheDocument();
  });

  it("renders a bar per stage with the transaction count", () => {
    render(<StageWidth schedule={SCHEDULE} />);
    expect(
      screen.getByRole("img", { name: /Transactions per stage/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("stage 0")).toBeInTheDocument();
    expect(screen.getByText("stage 1")).toBeInTheDocument();
    expect(screen.getByText("stage 2")).toBeInTheDocument();
    expect(screen.getByText("3 txns")).toBeInTheDocument();
    expect(screen.getByText("2 txns")).toBeInTheDocument();
    expect(screen.getByText("4 txns")).toBeInTheDocument();
  });
});
