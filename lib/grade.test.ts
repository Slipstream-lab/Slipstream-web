import { describe, it, expect } from "vitest";
import {
  clampScore,
  scoreToLetter,
  scoreToGrade,
  GRADE_THRESHOLDS,
  parseGradeThresholds,
  thresholdsEqual,
  type GradeThreshold,
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

  it("pins the exact threshold table (golden)", () => {
    // Golden values: any accidental change here fails the suite, flagging
    // divergence from slipstream-api's grade model.
    expect(GRADE_THRESHOLDS).toEqual([
      { min: 90, letter: "A" },
      { min: 75, letter: "B" },
      { min: 60, letter: "C" },
      { min: 40, letter: "D" },
      { min: 0, letter: "F" },
    ]);
  });
});

describe("grade threshold drift detection", () => {
  // The thresholds the API's grade model is expected to declare. When
  // slipstream-api exposes its thresholds (constant or endpoint), feed that
  // snapshot to `thresholdsEqual` here instead of this inline literal.
  const API_GRADE_THRESHOLDS: GradeThreshold[] = [
    { min: 90, letter: "A" },
    { min: 75, letter: "B" },
    { min: 60, letter: "C" },
    { min: 40, letter: "D" },
    { min: 0, letter: "F" },
  ];

  it("matches the API's declared thresholds", () => {
    expect(thresholdsEqual(GRADE_THRESHOLDS, API_GRADE_THRESHOLDS)).toBe(true);
  });

  it("detects a mismatch with the API's declared thresholds", () => {
    expect(
      thresholdsEqual(GRADE_THRESHOLDS, [
        { min: 90, letter: "A" },
        { min: 80, letter: "B" },
        { min: 60, letter: "C" },
        { min: 40, letter: "D" },
        { min: 0, letter: "F" },
      ]),
    ).toBe(false);
  });

  it("parses a well-formed API threshold table", () => {
    expect(
      parseGradeThresholds([
        { min: 90, letter: "A" },
        { min: 0, letter: "F" },
      ]),
    ).toEqual([
      { min: 90, letter: "A" },
      { min: 0, letter: "F" },
    ]);
  });

  it("rejects malformed API threshold tables", () => {
    expect(parseGradeThresholds("nope")).toBeNull();
    expect(parseGradeThresholds([{ min: "x", letter: "A" }])).toBeNull();
    expect(parseGradeThresholds([{ min: 90, letter: "Z" }])).toBeNull();
    expect(parseGradeThresholds(null)).toBeNull();
  });
});
