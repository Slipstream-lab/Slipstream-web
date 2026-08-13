import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CompareForm } from "@/components/CompareForm";
import { api, ApiError } from "@/lib/api";
import type { Comparison } from "@/lib/api";

const COMPARISON: Comparison = {
  leftId: "c1",
  rightId: "c2",
  summary: {
    detector_findings_delta: -2,
    storage_reads_delta: -5,
    storage_writes_delta: 1,
  },
  functions: [],
};

describe("CompareForm", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("submits two ids and renders the result", async () => {
    const spy = vi.spyOn(api, "compare").mockResolvedValue(COMPARISON);
    render(<CompareForm />);
    fireEvent.change(screen.getByLabelText(/baseline contract id/i), {
      target: { value: "c1" },
    });
    fireEvent.change(screen.getByLabelText(/candidate contract id/i), {
      target: { value: "c2" },
    });
    fireEvent.click(screen.getByRole("button", { name: /compare/i }));

    expect(await screen.findByText(/Summary deltas/)).toBeInTheDocument();
    expect(spy).toHaveBeenCalledWith("c1", "c2");
  });

  it("shows an error when the ids are missing", async () => {
    render(<CompareForm />);
    fireEvent.click(screen.getByRole("button", { name: /compare/i }));
    expect(
      await screen.findByText(/Enter both a baseline and a candidate/i),
    ).toBeInTheDocument();
  });

  it("shows an error when the API fails", async () => {
    vi.spyOn(api, "compare").mockRejectedValue(
      new ApiError("comparison unavailable", 500),
    );
    render(<CompareForm />);
    fireEvent.change(screen.getByLabelText(/baseline contract id/i), {
      target: { value: "c1" },
    });
    fireEvent.change(screen.getByLabelText(/candidate contract id/i), {
      target: { value: "c2" },
    });
    fireEvent.click(screen.getByRole("button", { name: /compare/i }));

    expect(
      await screen.findByText(/comparison unavailable/),
    ).toBeInTheDocument();
  });
});
