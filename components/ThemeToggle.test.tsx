import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "@/components/ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  it("reflects the current dark class and toggles to light", async () => {
    document.documentElement.classList.add("dark");
    render(<ThemeToggle />);

    const button = await screen.findByRole("button", {
      name: /switch to light theme/i,
    });
    fireEvent.click(button);

    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("slipstream-theme")).toBe("light");
  });

  it("toggles to dark and persists the choice", async () => {
    document.documentElement.classList.remove("dark");
    render(<ThemeToggle />);

    const button = await screen.findByRole("button", {
      name: /switch to dark theme/i,
    });
    fireEvent.click(button);

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("slipstream-theme")).toBe("dark");
  });
});
