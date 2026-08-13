import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ClusterTimeline } from "@/components/ClusterTimeline";
import type { Schedule } from "@/lib/api";

const SCHEDULE: Schedule = {
  stages: [
    { txns: [0, 4, 8] },
    { txns: [1, 5, 9] },
  ],
};

describe("ClusterTimeline", () => {
  it("renders a focusable button per transaction", () => {
    render(<ClusterTimeline schedule={SCHEDULE} />);
    const cell = screen.getByRole("button", {
      name: /transaction 4 in stage 0/i,
    });
    expect(cell).toBeInTheDocument();
    // Buttons are natively keyboard-focusable.
    expect(cell.tagName).toBe("BUTTON");
  });

  it("shows an empty message when there is no schedule", () => {
    render(<ClusterTimeline schedule={{ stages: [] }} />);
    expect(screen.getByText(/No schedule to display/i)).toBeInTheDocument();
  });

  it("highlights a transaction on focus (keyboard)", () => {
    render(<ClusterTimeline schedule={SCHEDULE} />);
    const cell = screen.getByRole("button", {
      name: /transaction 4 in stage 0/i,
    });
    fireEvent.focus(cell);
    expect(cell).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/transaction 4 · stage 0/)).toBeInTheDocument();
  });

  it("highlights a transaction on hover", () => {
    render(<ClusterTimeline schedule={SCHEDULE} />);
    const cell = screen.getByRole("button", {
      name: /transaction 9 in stage 1/i,
    });
    fireEvent.mouseEnter(cell);
    expect(cell).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/transaction 9 · stage 1/)).toBeInTheDocument();
  });

  it("surfaces a footprint when the resolver is provided", () => {
    render(
      <ClusterTimeline
        schedule={SCHEDULE}
        txnFootprint={(txn) =>
          txn === 4 ? "reads/writes Counter" : undefined
        }
      />,
    );
    fireEvent.focus(
      screen.getByRole("button", { name: /transaction 4 in stage 0/i }),
    );
    expect(screen.getByText(/reads\/writes Counter/)).toBeInTheDocument();
  });
});
