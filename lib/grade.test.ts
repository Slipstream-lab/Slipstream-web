import { describe, it, expect } from "vitest";
import {
  clampScore,
  scoreToLetter,
  scoreToGrade,
  GRADE_THRESHOLDS,
} from "@/lib/grade";

describe("grade", () => {
  it("clamps scores into 0-100", () => {
    expect(clampScore(-5)).toBe(0);
    expect(clampScore(150)).toBe(100);
    expect(clampScore(50)).toBe(50);
    expect(clampScore(NaN)).toBe(0);
  });

  it("maps scores to letters at the documented thresholds", () => {
    expect(scoreToLetter(100)).toBe("A");
    expect(scoreToLetter(90)).toBe("A");
    expect(scoreToLetter(89)).toBe("B");
    expect(scoreToLetter(75)).toBe("B");
    expect(scoreToLetter(60)).toBe("C");
    expect(scoreToLetter(40)).toBe("D");
    expect(scoreToLetter(39)).toBe("F");
    expect(scoreToLetter(0)).toBe("F");
  });

  it("clamps out-of-range scores before mapping", () => {
    expect(scoreToLetter(1000)).toBe("A");
    expect(scoreToLetter(-1)).toBe("F");
  });

  it("returns a tone and label for each grade", () => {
    const a = scoreToGrade(95);
    expect(a.letter).toBe("A");
    expect(a.tone).toBe("green");
    expect(a.label).toMatch(/parallelism/i);
    expect(scoreToGrade(10).tone).toBe("red");
  });

  it("thresholds are ordered descending and cover zero", () => {
    for (let i = 1; i < GRADE_THRESHOLDS.length; i++) {
      expect(GRADE_THRESHOLDS[i].min).toBeLessThan(GRADE_THRESHOLDS[i - 1].min);
    }
    expect(GRADE_THRESHOLDS[GRADE_THRESHOLDS.length - 1].min).toBe(0);
  });
});
