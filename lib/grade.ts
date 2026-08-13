/**
 * Score → letter-grade mapping and presentation helpers.
 *
 * Pure and deterministic. The score is a 0–100 contention score (higher is
 * better parallelism / lower contention) produced by `slipstream-api`; this
 * module only maps it to a letter and presentation metadata.
 *
 * ## Grade thresholds — single source of truth (web side)
 *
 * The letter boundaries below MUST match `slipstream-api`'s grade model
 * (`modules/analysis/grade.ts`, the `GRADE_THRESHOLDS` constant there):
 *
 * | Score (inclusive lower bound) | Letter |
 * | ----------------------------- | ------ |
 * | 90                            | A      |
 * | 75                            | B      |
 * | 60                            | C      |
 * | 40                            | D      |
 * | 0                             | F      |
 *
 * Divergence would show a different grade than the API computed. Two defenses
 * exist against drift:
 *   - `lib/grade.test.ts` pins the exact threshold table (golden test).
 *   - `parseGradeThresholds` + `thresholdsEqual` let the app/tests compare
 *     against a snapshot the API exports (constant or endpoint) when one
 *     becomes available.
 */

export type Letter = "A" | "B" | "C" | "D" | "F";

export interface GradeView {
  letter: Letter;
  /** A semantic color token (Tailwind-friendly) for the badge. */
  tone: "green" | "lime" | "amber" | "orange" | "red";
  /** A short human label. */
  label: string;
}

export interface GradeThreshold {
  min: number;
  letter: Letter;
}

/** Inclusive lower bounds for each letter grade (descending). */
export const GRADE_THRESHOLDS: ReadonlyArray<GradeThreshold> = [
  { min: 90, letter: "A" },
  { min: 75, letter: "B" },
  { min: 60, letter: "C" },
  { min: 40, letter: "D" },
  { min: 0, letter: "F" },
];

const LETTER_META: Record<Letter, Omit<GradeView, "letter">> = {
  A: { tone: "green", label: "Excellent parallelism" },
  B: { tone: "lime", label: "Good parallelism" },
  C: { tone: "amber", label: "Moderate contention" },
  D: { tone: "orange", label: "High contention" },
  F: { tone: "red", label: "Severe contention" },
};

/** Clamps a raw number into the valid 0–100 score range. */
export function clampScore(score: number): number {
  if (Number.isNaN(score)) return 0;
  return Math.max(0, Math.min(100, score));
}

/** Maps a 0–100 score to its letter grade. */
export function scoreToLetter(score: number): Letter {
  const s = clampScore(score);
  for (const { min, letter } of GRADE_THRESHOLDS) {
    if (s >= min) return letter;
  }
  return "F";
}

/** Maps a 0–100 score to a full grade view (letter + presentation). */
export function scoreToGrade(score: number): GradeView {
  const letter = scoreToLetter(score);
  return { letter, ...LETTER_META[letter] };
}

/**
 * Parses an API-exported threshold table into a validated shape, or `null` if
 * the input is malformed. Used by drift-detection tests against a snapshot the
 * API exposes (constant or endpoint).
 */
export function parseGradeThresholds(
  input: unknown,
): GradeThreshold[] | null {
  if (!Array.isArray(input)) return null;
  const letters: readonly Letter[] = ["A", "B", "C", "D", "F"];
  const out: GradeThreshold[] = [];
  for (const item of input) {
    if (typeof item !== "object" || item === null) return null;
    const { min, letter } = item as { min?: unknown; letter?: unknown };
    if (typeof min !== "number" || typeof letter !== "string") return null;
    if (!letters.includes(letter as Letter)) return null;
    out.push({ min, letter: letter as Letter });
  }
  return out;
}

/** True when two threshold tables declare the same boundaries. */
export function thresholdsEqual(
  a: readonly GradeThreshold[],
  b: readonly GradeThreshold[],
): boolean {
  if (a.length !== b.length) return false;
  return a.every((t, i) => t.min === b[i].min && t.letter === b[i].letter);
}
