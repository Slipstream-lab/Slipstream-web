import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FixList } from "@/components/FixList";
import type { DetectorFinding } from "@/lib/api";

describe("FixList", () => {
  it("shows a positive empty state when there are no findings", () => {
    render(<FixList findings={[]} />);
    expect(screen.getByText(/nothing to fix/i)).toBeInTheDocument();
  });

  it("groups findings by detector and shows a recommendation", () => {
    const findings: DetectorFinding[] = [
      {
        detector: "read-modify-write",
        function: "increment",
        key: "Counter",
        message: "reads and writes Counter",
      },
      {
        detector: "read-modify-write",
        function: "bump",
        key: "Counter",
        message: "reads and writes Counter",
      },
      {
        detector: "global-static-write",
        function: null,
        key: "Counter",
        message: "written from multiple functions",
      },
    ];
    render(<FixList findings={findings} />);
    // Recommendation titles from the recommendations map.
    expect(screen.getByText(/Avoid read-modify-write/i)).toBeInTheDocument();
    expect(screen.getByText(/Shard the global key/i)).toBeInTheDocument();
    // Group count badge for the two RMW findings.
    expect(screen.getByText(/Read Modify Write · 2/)).toBeInTheDocument();
    // A null function renders as "(module)".
    expect(screen.getByText(/\(module\)/)).toBeInTheDocument();
  });
});
