import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { GradeBadge } from "@/components/GradeBadge";

describe("GradeBadge", () => {
  it("shows the letter for a score", () => {
    render(<GradeBadge score={95} />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("shows an F for a low score and exposes an accessible label", () => {
    render(<GradeBadge score={10} />);
    expect(screen.getByText("F")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Grade F/i })).toBeInTheDocument();
  });

  it("optionally renders the numeric score", () => {
    render(<GradeBadge score={72} showScore />);
    expect(screen.getByText("72")).toBeInTheDocument();
  });
});
